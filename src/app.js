// on load, select first category-button

const COLORS = {
  INACTIVE: '#b9b9b9',
  ACTIVE: '#777'
}

const $categories = $('nav').find('[data-click]')
const $counties = $('svg').find('path')
const $popover = $('#popover')

$.get('./data/awards-db.json', function (awards) {
  $categories.click(highlightCountiesInPortfolio)

  $counties.mouseover(displayPopover)

  function displayPopover ({ target, clientX, clientY }) {
    // clearPopover
    const { id } = target 
    $popover.css({
      top: clientY,
      left: clientX,
      opacity: 1
    }).find('[data-county]').text(id)

  }

  function clearMap () {
    $('svg path').css('fill', COLORS.INACTIVE)
  }

  function highlightButton (e) {
    $categories.removeClass('active')
    $(e.target).addClass('active')
  }

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

      $(el).css('fill', COLORS.ACTIVE)
    })
  }
})
