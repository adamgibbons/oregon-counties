// on load, select first category-button?

const DIMENSIONS = {
  HEIGHT: 100,
  WIDTH: 200
}

const COLORS = {
  INACTIVE: '#b9b9b9',
  ACTIVE: '#777'
}

const $categories = $('nav').find('[data-click]')
const $counties = $('svg').find('path')
const $popover = $('#popover')
const $popoverCloseButton = $('#popover').find('.close')

$.get('./data/awards-db.json', function (awards) {
  $categories.click(highlightCountiesInPortfolio)

  $counties.click(function (e) {
    displayPopover(e, awards)
  })

  $popoverCloseButton.click(closePopover)

  function highlightCountiesInPortfolio (e) {
    clearMap()
    highlightButton(e)

    const portfolio = $(e.target).text()
    const result = awards.filter(function (award) {
      return award.Portfolio === portfolio
    })

    const counties = _.uniqBy(result.map(function (r) { return r['Recipient County'] }))

    const countiesList = counties.map(function (county) {
      return `#${county.replace(' ', '_')}`
    })

    countiesList.map(function (el) {
      if (el === '#') return

      $(el).addClass('active')
    })
  }
})

function closePopover () {
  $popover.css({
    opacity: 0,
    'z-index': '-1'
  })
}

function displayPopover ({ target, clientX, clientY }, awards) {
  if (!$(target).hasClass('active')) return

  const { id } = target
  const portfolio = $categories.filter('.active').text()

  $popover.css({
    top: clientY - DIMENSIONS.HEIGHT / 2,
    left: clientX - DIMENSIONS.WIDTH / 2,
    opacity: 1,
    'z-index': 1
  })

  const awardsCount = countAwardsByCounty(id, portfolio, awards)

  $popover.find('[data-county]').text(id.replace('_', ' '))
  $popover.find('[data-awards-county]').text(awardsCount)
}

function clearMap () {
  $counties.removeClass('active')
}

function highlightButton ({ target }) {
  $categories.removeClass('active')
  $(target).addClass('active')
}

function countAwardsByCounty(id, portolio, awards) {
  return awards.filter(function (award) {
    return award['Recipient County'] === id.replace('_', ' ') && award.Portfolio === portolio
  }).length
}