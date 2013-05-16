// ***
//  Memory game plugin for jQuery
//  Author: Yane Frenski
// ***

// IE hack for indexOf
if(!Array.indexOf){
  Array.prototype.indexOf = function(obj){
   for(var i=0; i<this.length; i++){
    if(this[i]==obj){
     return i;
    }
   }
   return -1;
  }
}


(function($) {
  $.fn.quizyMemoryGame = function(options) {
    
    // VARIABLES **************************************************************
    // ************************************************************************
    
    // gets the parameters
    var opts = $.extend({}, $.fn.quizyMemoryGame.defaults, options);
    
    // keeps the number of cards
    var itemsNum = $(this).children('ul').children('li').length;
    
    // we keep here the selected correct items (after we have a match)
    var correctItems = new Array();
    
    // keeps the matching ids = which elements match
    var matches = new Array();
    
    // keep the inner html of the elements(to hide them from web inspector, etc)
    var inHtml = new Array();
    
    // a selector class for the cards
    var itemsClass = 'quizy-mg-item';
    
    // keep the class and the id of the selected item
    var selItemClass = '';
    var selItemId = -1;
    
    // keeps the number of clicks for a turn - it can be 0, 1 or 2
    var numClicks = 0;
    
    // keeps the number of clicks in general
    var numTotalClicks = 0;
    
    // keep the numer of matches and the number of seconds for the summary
    var numMatches = 0;
    var numSeconds = 0;
    
    // a timer variable
    var gameTimer;
    
    // variables from the plugin parameters (defined and described at the end)
    var delayShow = opts.openDelay;
    var w = opts.itemWidth;
    var h = opts.itemHeight;
    var m = opts.itemsMargin;
    var rowNum = Math.ceil(itemsNum/opts.colCount);
    
    
    // FUNCTIONS **************************************************************
    // ************************************************************************
        
    // A function to handle the element click
    var handleClick = function(){
      // starts the timer
      if(numTotalClicks==0) gameTimer = setInterval(incTime,1000);
      // counts the clicks
      numTotalClicks ++;
      // keeps the class for the clicked item
      var tId = $(this).attr('id');
      var tdIdNum = parseInt(tId.substring(itemsClass.length,tId.length));
      var tClass = matches[tdIdNum];
      // calls the unbind function (makes the button inactive)
      unbindClick($(this));
      showItem($(this),tdIdNum);
      // if it's the first click out of two (turning the first card)
      if(numClicks==0){
        numClicks ++ ;
        selItemClass = tClass;
        selItemId = tId;
      // if it's the second click out of two (turning the second card)
      }else if(numClicks == 1){
        numClicks = 0;
        // if both have the same class = we HAVE a match
        if(tClass == selItemClass){
          showResIcon('correct');
          unbindClick($('.'+tClass));
          // Adds the turned cards to the correct items array
          correctItems.push(tId);
          correctItems.push(selItemId);
          //increases the number of correct matches
          numMatches ++ ;
          // If all of the cards are turned and the game is complete
          if(numMatches == itemsNum/2){
            // removes the timer
            clearInterval(gameTimer);
            // if game summary is set, adds the info to it and shows it.
            if(opts.gameSummary){
              $('div#quizy-game-summary').
                  children('div#gs-column2').
                  html(numSeconds+'<br>'+opts.textSummaryTime);
              $('div#quizy-game-summary').
                  children('div#gs-column3').
                  html(numTotalClicks+'<br>'+opts.textSummaryClicks);
              $('div#quizy-game-summary').delay(2000).fadeIn(1000);
            }
            // if is set makes an AJAX call and sends the the necessary params
            if(opts.onFinishCall!=''){
              opts.onFinishCall({ clicks: numTotalClicks, time: numSeconds } );
            }
          }
        // if they dont have the same class = WE DON'T HAVE a match
        }else{
          showResIcon('wrong');
          unbindClick($('div.'+itemsClass));
          // turns the cards back
          hideItem($('div#'+selItemId));
          hideItem($(this));
          // after a certain time adds back the click event to the card
          setTimeout( function(){
            $('.'+itemsClass).each(function(){
              var myId = $(this).attr('id');
              if(correctItems.indexOf(myId) == -1){
                bindClick($(this));
              }
            });
          }, delayShow+opts.animSpeed+250);
        }
      }
    }
    
    //removes a click from an element
    var unbindClick = function(el){
      el.unbind('click');
      el.css('cursor','default');
    }
    
    // adds a click to an element
    var bindClick = function(el){
      el.bind('click',handleClick);
      el.css('cursor','pointer');
    }
    
    // shows item with different animation/based on settings
    var showItem = function(el,id){
      var topId = el.children('div.quizy-mg-item-top').attr('id');
      switch(opts.animType){
        default:
        case 'fade':
          addInHTML(el,id);
          $('#'+topId).fadeOut(opts.animSpeed);
        break;
        case 'flip':
          setTimeout( function(){
            addInHTML(el,id)
          }, opts.animSpeed*2);
          el.flip({
            direction:opts.flipAnim,
            speed: opts.animSpeed,
            content: el.children('div.quizy-mg-item-bottom'),
            color:'#777'
          });
        break;
        case 'scroll':
          addInHTML(el,id);
          $('#'+topId).animate({height: 'toggle', opacity:0.3},opts.animSpeed);
        break;
      }
    }
    
    // hides item with different animation/based on settings
    var hideItem = function(el){
      var topId = el.children('div.quizy-mg-item-top').attr('id');
      switch(opts.animType){
        default:
        case 'fade':
          $('#'+topId).delay(delayShow).fadeIn(opts.animSpeed);
          setTimeout( function(){
            removeInHTML(el)
          }, delayShow+opts.animSpeed);
        break;
        case 'flip':
          setTimeout( function(){
           el.revertFlip();
          }, delayShow);
          setTimeout( function(){
           removeInHTML(el);
          }, delayShow+opts.animSpeed*4);
        break;
        case 'scroll':
          $('#'+topId).delay(delayShow).
                      animate({height: 'toggle', opacity:1},opts.animSpeed);
          setTimeout( function(){
            removeInHTML(el)
            }, delayShow+opts.animSpeed);
        break;
      }      
    }
    
    //shows and hids the correct/wrong message after an action
    var showResIcon = function(type){
      if(opts.resultIcons){
        var el;
        var time = Math.round(delayShow/3);
        if(type=='wrong'){
          el = $('div#quizy-mg-msgwrong');
        }else if(type=='correct'){
          el = $('div#quizy-mg-msgcorrect');
        }
        el.delay(time).fadeIn(time/2).delay(time/2).hide("explode", time/2);
      }
    }
    
    // time functions
    var incTime = function(){
      numSeconds ++;
    }
    
    // function for adding the inner HTMK
    var addInHTML = function(el,id){
      el.children('.quizy-mg-item-bottom')
        .children('.mgcard-show')
        .html(inHtml[id]);
    }
    
    var removeInHTML = function(el){
      el.children('.quizy-mg-item-bottom').children('.mgcard-show').html('');
    }
    
    
    // MAIN CODE **************************************************************
    // ************************************************************************
    
    // hides the <li> items
    $(this).children('ul').hide();
    
    // makes the div wrapper big enough
    $(this).css({height:rowNum*(h+m)+'px'});
    
    // creates an array for randomising the items 
    // and creates an empty inner html array
    var ranArr = Array();
    for(var j=0; j< itemsNum; j++){
      inHtml[j] = '';
      ranArr.push(j);
    }
    
    // Generates all the elements, based on the data in the <li> elements
    var i=0;
    while(i<itemsNum){
      
      // randozises the card - picks an item with a random key and
      // removes it from the random array
      var pick = Math.floor(Math.random()*ranArr.length);
      var j = ranArr[pick];
      ranArr.splice(pick,1);
      
      // gets the data from each <li> element
      var inEl = $(this).children('ul').children('li').eq(j);
      
      // calculates the position of each element
      var xRatio = (i+opts.colCount)%opts.colCount;
      var yRatio = Math.floor(i/opts.colCount);
      var l = xRatio*(w+m);
      var t = yRatio*(h+m);
      
      // Adds the innerHtml to the array
      inHtml[j] = inEl.html();
      // console.log(j, inEl.html());
      
      // appends the cards to the element
      $(this).append('<div id="'+itemsClass+j+'" class="'+itemsClass+
      '" style="width:'+
      w+'px; height:'+h+'px; left:'+l+'px; top:'+t+'px">' +
      '<div class="quizy-mg-item-bottom"><div class="mgcard-show">'+
      '</div></div><div id="quizy-mg-item-top'+j+
      '" class="quizy-mg-item-top" style="width:'+
      w+'px; height:'+h+'px;"></div></div>');
      i++;
      
      // Adds the element match id to the array of matches
      matches[j] = inEl.attr('class');
      
    }
    
    // removes the initial <li> elements
    $(this).children('ul').remove();
    
    // adds the icons for the result after each match
    if(opts.resultIcons){
      $(this).append('<div id="quizy-mg-msgwrong"'+
      ' class="quizy-mg-notification-fly quizy-mg-notification-fly-neg"></div>'+
      '<div id="quizy-mg-msgcorrect" class="quizy-mg-notification-fly '+
      ' quizy-mg-notification-fly-pos"></div>');
      // positions the result icons in the middle of the div wrapper
      var xMid = $(this).width()/2 - 
                  $('div.quizy-mg-notification-fly').width()/2;
      var yMid = $(this).height()/2 - 
                  $('div.quizy-mg-notification-fly').height()/2 -
                  opts.itemsMargin/2;
      $('div.quizy-mg-notification-fly').css({top:yMid+'px',left:xMid+'px'});
    }
    
    // Appends game summary div if set in the opts.
    if(opts.gameSummary){
      $(this).append('<div id="quizy-game-summary"><div id="gs-column1">'+
                      opts.textSummaryTitle+
                      '</div><div id="gs-column2"></div>'+
                      '<div id="gs-column3"></div></div>');
      // positions the summary div in the middle of the div wrapper
      var xMid = $(this).width()/2 - 
                  $('div#quizy-game-summary').width()/2;
      var yMid = $(this).height()/2 - 
                  $('div#quizy-game-summary').height()/2 -
                  opts.itemsMargin/2;
      $('div#quizy-game-summary').css({top:yMid+'px',left:xMid+'px'});
      // adds a click event to the summary div to be removed on click
      $('div#quizy-game-summary').click(function(){
        $(this).remove();
      });
    }
    
    // adds the click event to each element
    $('.quizy-mg-item').click(handleClick);
    
  }
  
  /**** plugin parameters *****************************************************
  *****************************************************************************
  
    * itemWidth:         The width of the card in pixels.
    * itemHeight:        The width of the card in pixels.
                         Don't forget to change the style of the element in
                         the CSS if you change one of this two paremeters
    * itemsMargin:       The right and bottom margin of the element defining
                         the margin between the cards.
    * colCount:          In how many columns the plugin should arrange the cards
    * animType:          The type of animation used when a card is clicked. 
                         Can be 'flip', 'fade' and 'scroll'.
    * flipAnim:          The direction of the flip animation, if chosen in the
                         previous property.Possible values: 'tb', 'bt', 'lr', 'rl'
    * animSpeed:         How fast the card turning animation should be (in ms)
    * openDelay:         For how long the card should stay turned (in ms)
    * resultIcons:       After turning each to pairs the plugin shows an icon
                         if it was correct or not. Can be true or false
    * gameSummary:       At the end of the game the plugin shows a short game
                         summary - how many clicks the user has done and how 
                         much time it took to complete the game. 
                         Can be true or false
    * textSummaryTitle:  The title of the summary text at the end of the game
    * textSummaryClicks: The same as the previous but used for the text 
                         indicating the clicks done.
    * textSummaryTime:   The same as the previous but used for the text 
                         indicating the time to complete.
    * onFinishCall:      The call back function
                         It sends two arguments: clicks and time. 
                         
  ****************************************************************************/
  
  $.fn.quizyMemoryGame.defaults = {itemWidth: 156, itemHeight: 156, itemsMargin:10, colCount:4, animType:'scroll', animSpeed:250, openDelay:2500, flipAnim:'rl', resultIcons:true, gameSummary:true, textSummaryTitle:'Your game summary', textSummaryClicks:'clicks', textSummaryTime:'seconds', onFinishCall:''}
  
  
})(jQuery);