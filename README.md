Quizy Memory Game
========

#### jQuery memory card/ pairs game plugin ####

The QuizY Memory Card Game plugin is a jQuery plugin, which allows the creation of memory games. It is very simple to use and provides various of settings in order to enhance its usability. The biggest advantage of the plugin is that it allows you to add any type of content on the back side of the card, not only images.

[Demo and Documentation](http://memorygame.quizyplugin.com/)


### Usage ###

Download the [plugin](https://github.com/frenski/quizy-memorygame) and include all the necessary files before the closing body tag.

```html
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js" /></script>
<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.8.17/jquery-ui.min.js" /></script>
<script src="js/jquery.flip.min.js" /></script>
<script src="js/jquery.quizymemorygame.js" /></script>
...
</body>
```
Add the css file to the head: 

```html
<head>
  ...
  <link rel="stylesheet" type="text/css" href="css/quizymemorygame.css" />
  ...
</head>
```

Call the plugin after all the script files and before the closing body tag like this:

```html
<script>
$('#my-memorygame').quizyMemoryGame({itemWidth: 156, itemHeight: 156, itemsMargin:40, colCount:5, animType:'flip' , flipAnim:'tb', animSpeed:250, resultIcons:true});
</script>
```
Create a <div> element with the same id ('my-memorygame') as we used in the activation code. Then you can create the different card items using <li> tags. Every <li> element you create will represent a different card. The content of each <li> element is what you see when the card is being showed. The order of the items doesn't really matter (they are being randomised later anyways ), what matters is the class name. If you want the item with the 'Uruguay' text to match the one with the same text, then you put class="match1". For the next pairs you put class="match2" and so on... As said, you can put whatever you want within the <li> tag - texts, images, etc. If you want to have a center-aligned image, I suggest that you create a transparent png with the same size as the card (which by default is 156px x 156px).

```html
<div id="my-memorygame" class="quizy-memorygame">
<ul>
  <li class="match1">
    Uruguay
  </li>
  <li class="match2">
    Cuba
  </li>
  <li class="match1">
    Uruguay
  </li>
  <li class="match2">
    Cuba
  </li>
</ul>
</div>
```

### Properties ###
* itemWidth: The width of the card in pixels. The default is 156. If you want to change it, you should also change the background picture for the backside of the card (quizy-mg-item-top.jpg).
* itemHeight: The width of the card in pixels. The default is 156. If you want to change it, you should also change the background picture for the backside of the card (quizy-mg-item-top.jpg).
* itemsMargin: The right and bottom margin of the element defining the margin between the cards. The default is 10 pixels.
* colCount: In how many columns the plugin should arrange the cards. the default is 4.
* animType: The type of animation used when a card is clicked. Can be 'flip', 'fade' and 'scroll'.
* flipAnim: The direction of the flip animation (inherited from the flip! plugin), if chosen in the previous property.Possible values: 'tb', 'bt', 'lr', 'rl'. Default is:'tb')
* animSpeed: How fast the card turning animation should be (in milliseconds), the default is 250ms.
* openDelay: For how long the card should stay turned (in milliseconds). The default is 2500ms.
* resultIcons: After turning each to pairs the plugin shows an icon if it was correct or not. To turn this off, put false for its value.
* gameSummary: At the end of the game the plugin shows a short game summary - how many clicks the user has done and how much time it took to complete the game. To turn this off, put false for its value.
* textSummaryTitle: If you want to have a game summary at the end, this is an option to change the title text of this summary. It is very useful also if you want use the plugin in language different than English.
* textSummaryClicks: The same as the previous but used for the text indicating the clicks done.
* textSummaryTime: The same as the previous but used for the text indicating the time to complete.
* onFinishCall: A callback function. Will return object with two parameters: clicks and time. You can add it when calling the plugin like this: onFinishCall: function(param){alert(param.clicks)}


### License ###

This plugin is [MIT](http://en.wikipedia.org/wiki/MIT_License) licensed.

</body>