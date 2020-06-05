howMany = 12;
listButton = $('button.list-view');
gridButton = $('button.grid-view');
wrapper = $('div.wrapper');

// div = 
// `<div class="item">
//     <a href="javascript:void(0);"><img src="http://files.braadmartin.com/gretsch-catalina-club-in-natural.jpg" /></a>
//     <div class="details">
//         <h2>Gretsch Catalina Club Jazz</h2>
//         <span>Yours for only <span class="price">$599.99</span></span>
//         <p>What a classic kit! Available in several great colors, including Natural (shown), Walnut Glaze, White Marine, Copper Sparkle, and Black Galaxy. Every drummer needs one of these.</p>
//     </div>
// </div>`;

// // Set up divs
// for (i = 0; i < howMany; i++) { 
// 	$('.wrapper').append( div );  
// }

listButton.on('click',function(){
	
  gridButton.removeClass('on');
  listButton.addClass('on');
  wrapper.removeClass('grid').addClass('list');
  
});

gridButton.on('click',function(){
	
  listButton.removeClass('on');
  gridButton.addClass('on');
  wrapper.removeClass('list').addClass('grid');
  
});


