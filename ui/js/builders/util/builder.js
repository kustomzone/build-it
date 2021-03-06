import EventEmitter from 'events'

import moment from 'moment'
import React from 'react'

import Observable from './observable'
import Task from './task'

export default class Builder extends EventEmitter {
  constructor (opts, defaults, className) {
    super()
    this.opts = Object.assign({
      task: 'Building',
      label: []
    }, defaults, opts)
    if (!Array.isArray(this.opts.task)) {
      this.opts.task = [this.opts.task]
    }
    if (!Array.isArray(this.opts.label)) {
      this.opts.label = [this.opts.label]
    }

    this.logs = []
    this._name = className

    window.addEventListener('beforeunload', () => {
      this.stop()
    })

    this._task = new Task({
      label: [...this.opts.label, ...this.opts.task, 'Initializing'],
      progress: 0
    })
    this.task = new Observable(this._task)
    process.nextTick(() => {
      this.on('build', () => {
        this.task.value = this._task
      })
      this.on('built', () => {
        const time = moment()
        process.nextTick(() => {
          this.task.value = new Task({
            label: [
              ...this.opts.label,
              <span>
                Build <strong>
                  {this.buildOK() ? 'Succeeded' : 'Failed'}
                </strong>
              </span>,
              time
            ],
            progress: 1
          })
        })
      })
    })
  }
  toString () {
    return `${this._name}: ${this.task.value.toString()}`
  }
  updateProgress ({ progress, message }) {
    const task = this.task.value
    if (progress) {
      task.progress = progress
    }
    if (message) {
      task.label = this._task.label.slice(0, -1).concat(message)
    }
    this.task.value = task
  }
  setStats (stats) {
    this.stats = stats
  }
  _log (message) {
    if (typeof message === 'string') {
      return this._log({
        message
      })
    }
    message.date = new Date()
    if (!message.type) {
      message.type = 'log'
    }
    this.logs.push(message)
  }
  clearLogs () {
    this.logs = []
  }

  async init () {
    // parse config
    throw new Error('must specify an init handler')
  }
  start () {
    throw new Error('must specify a start function')
  }
  stop () {
    throw new Error('must specify a stop function')
  }
}
