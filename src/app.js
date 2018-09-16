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
const $accordion = $('#accordion')

$.get('./data/awards-db.json', function (awards) {
  $categories.click(highlightCountiesInPortfolio)

  $counties.click(function (e) {
    displayPopover(e, awards)
  })

  $popoverCloseButton.click(closePopover)

  function highlightCountiesInPortfolio (e) {
    e.preventDefault()
    closePopover()
    clearMap()

    if ($('nav')[0].scrollWidth < 600) {
      if ($(e.target).hasClass('active')) {
        // expand
        $('nav').addClass('expanded hot')
      } else if ($('nav').hasClass('expanded')) {
        highlightButton(e)
        $('nav').removeClass('expanded hot')
      } else {
        $('nav').addClass('expanded')
      }
    } else {
      highlightButton(e)
    }

    const portfolio = $(e.target).text()
    const result = awards.filter(function (award) {
      return award.Portfolio === portfolio
    })

    const counties = _.uniqBy(result.map(function (r) { return r['Recipient County'] }))

    const countiesList = counties.map(function (county) {
      return `#${county.replace(' ', '_')}`
    })

    $accordion.empty()
    countiesList.map(function (el) {
      if (el === '#') return

      $(el).addClass('active')

      $accordion.append('<div class="leaf">' + el.replace('#', '') + '</div>')
    })

    $accordion.find('.leaf').click(function (e) {
      toggleAccordionNode(e, portfolio, awards)
    })
  }
})

function toggleAccordionNode (e, portfolio, awards) {
  const $node = $(e.target)

  if ($node.hasClass('expanded')) {
    $node.removeClass('expanded')
  } else {
    $accordion.find('.leaf').removeClass('expanded')
    $node.addClass('expanded')
  }

  const awardsCount = countAwardsByCounty($node.text(), portfolio, awards)
  const awardsDollars = getSumTotalOfAwardsByCounty($node.text(), portfolio, awards)

  $node.append('<div>' + 'Awards:' + awardsCount + '</div>')
  $node.append('<div>' + 'Sum Total of Awards: $' + awardsDollars + '</div>')
}


function closePopover () {
  $popover.css({
    opacity: 0,
    left: '-1000px',
    top: '-1000px'
  })
}

function displayPopover ({ target, clientX, clientY }, awards) {
  if (!$(target).hasClass('active')) return

  const { id } = target
  const portfolio = $categories.filter('.active').text()

  $popover.css({
    top: clientY - DIMENSIONS.HEIGHT / 2,
    left: clientX - DIMENSIONS.WIDTH / 2,
    opacity: 1
  })

  const awardsCount = countAwardsByCounty(id, portfolio, awards)
  const awardsDollars = getSumTotalOfAwardsByCounty(id, portfolio, awards)

  $popover.find('[data-county]').text(id.replace('_', ' '))
  $popover.find('[data-awards-count]').text(awardsCount)
  $popover.find('[data-awards-dollars]').text(awardsDollars)
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

function getSumTotalOfAwardsByCounty(id, portolio, awards) {
  return awards.filter(function (award) {
    return award['Recipient County'] === id.replace('_', ' ') && award.Portfolio === portolio
  }).map((award) => {
    return parseInt(
      award['Award Amount']
        .replace('$', '')
        .replace(/,/g, '')
    )
  }).reduce((a, b) => {
    return a + b
  }, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}
