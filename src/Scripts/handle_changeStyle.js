var changeStyle = (oldStyle ,cssKey, unit, e) => {
  // unit指的是單位 看Style是否要加單位
  var newClass = {}
  newClass[cssKey] = unit ? e.target.value + unit : e.target.value
  
  console.log({
    style: $.extend({}, oldStyle, newClass)
  })

  return{
    style: $.extend({}, oldStyle, newClass)
  }
  
}

module.exports = changeStyle
