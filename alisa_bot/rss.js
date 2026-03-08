const RSS = require('rss-parser')
const EventEmitter = require('events')
const RSSParser = new RSS()
const fs = require('fs')


class RSSWatcher extends EventEmitter {
  constructor(rssChannels, timeout = 1000 * 5) {
    super()
    this._rssChannels = rssChannels
    this._rssFetchTimeout = timeout
    this._rssChannels = rssChannels
  }
  watch() {
    let RSSStorage
    this._watcherInstance = setInterval(() => {
      RSSStorage = JSON.parse(fs.readFileSync('./rssStorage.json'))
      this._rssChannels.forEach(async rsschnl => {
        RSSParser.parseURL(rsschnl).then(feed => {
          if(RSSStorage.lastids == undefined) {
            RSSStorage.lastids = {}
          }
          if(!RSSStorage.lastids[rsschnl]) {
            RSSStorage.lastids[rsschnl] = feed.items[0].guid
            this.emit('feedUpdate', rsschnl, feed.items[0])
            fs.writeFile('./rssStorage.json', JSON.stringify(RSSStorage), 'utf8', () => {})
          } else {
            if(RSSStorage.lastids[rsschnl] != feed.items[0].guid) {
              let pid = 1
              feed.items.forEach((f, idx) => {
                if(f.guid == RSSStorage.lastids[rsschnl]) {
                  pid = idx
                }
              })
              RSSStorage.lastids[rsschnl] = feed.items[0].guid
              fs.writeFile('./rssStorage.json', JSON.stringify(RSSStorage), 'utf8', () => {})
              feed.items.slice(0, pid).forEach(f => this.emit('feedUpdate', rsschnl, f))
            }
          }
        })

      })
    }, this._rssFetchTimeout)
  }
  stop() {
    if(this._watcherInstance !== undefined) clearTimeout(this._watcherInstance)
  }
}

module.exports = {
  RSSWatcher,
  RSSParser,
}
