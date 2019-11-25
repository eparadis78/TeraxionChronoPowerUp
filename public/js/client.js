/* global TrelloPowerUp */

var Promise = TrelloPowerUp.Promise;

var BLACK_ROCKET_ICON = 'https://cdn.glitch.com/1b42d7fe-bda8-4af8-a6c8-eff0cea9e08a%2Frocket-ship.png?1494946700421';
var TERAXION_ICON = 'https://cdn.glitch.com/19183bbf-5113-4855-a273-c1bf161c0444%2FTeraXion.ico?v=1569942286716'

var getFrontBadges = function(t){
		var ouverture = null
		var tempsres = null
		var today = new Date()
		var now = Math.round(today.getTime()/(1000*60)) //Nombre de minutes depuis le 1er janvier 1970
	return[
		{//Temps depuis ouverture
			dynamic: function(){
				return t.card('all')
				.then(function(card){
					card.customFieldItems.forEach(field => {
						if (field.idCustomField == "5d9239313f6ac6712c0defbb"){
							var temp = new Date(field.value.date)
							ouverture = Math.round(temp.getTime() /(1000*60))
						}
					});
					return{
						text: ouverture ? (now-ouverture) >= 60*3 ? Math.floor((now - ouverture)/60)+ " h depuis" : (now - ouverture) + " min depuis" : null,
						color : ouverture ? (	Math.abs(now - ouverture)/(60*3) <=0.25 ? "green" :  
												Math.abs(now - ouverture)/(60*3) <=0.50 ? "yellow" : 
												Math.abs(now - ouverture)/(60*3) <=0.75 ? "orange": 
												"red" ) :
												'green',
						refresh : 10
					}
				})
			}
		},
		{//Temps avant résolution
			dynamic : function(){
				return t.card('all')
				.then(function(card){
					card.customFieldItems.forEach(field => {
						if (field.idCustomField == "5d9239e35727f464345c44e4"){
							tempsres = field.value.number
						} else if (field.idCustomField == "5d9239313f6ac6712c0defbb"){
							var temp = new Date(field.value.date)
							ouverture = Math.round(temp.getTime()/(1000*60))						
						}
					});
					return {
						text: tempsres ? Math.abs(ouverture + parseInt(tempsres) - now) >= 60*3 ?  Math.floor((ouverture + parseInt(tempsres) - now)/60) + " h restant" :(ouverture + parseInt(tempsres) - now)+ " min restant" : ouverture ? "Aucun estimé" : null,
						color : tempsres ? (ouverture + parseInt(tempsres) - now) >= 0 ? "orange" : "red" :
											ouverture ? "blue" : null,
						refresh : 10
					}		
				})			
			}	
		}
	]
}
var getBackBadges = function(t){
	var ouverture = null
	var tempsres = null
	var today = new Date()
	var now = Math.round(today.getTime()/(1000*60))
	return[
	{//Temps depuis ouverture
		dynamic: function(){
			return t.card('all')
			.then(function(card){
				card.customFieldItems.forEach(field => {
					if (field.idCustomField == "5d9239313f6ac6712c0defbb"){
						var temp = new Date(field.value.date)
						ouverture = Math.round(temp.getTime()/(1000*60))
					}
				});
				return{
					text: ouverture ? "Temps écoulé depuis le début : \n\n" + (now - ouverture) + " minutes" : null,
					color : ouverture ? (	Math.abs(now - ouverture)/(60*3) <=0.25 ? "green" :  
											Math.abs(now - ouverture)/(60*3) <=0.50 ? "yellow" : 
											Math.abs(now - ouverture)/(60*3) <=0.75 ? "orange": 
											"red" ) :
											'green',
					refresh : 10
				}
			})
		}
	},
	{//Temps avant résolution
		dynamic : function(){
			return t.card('all')
			.then(function(card){
				card.customFieldItems.forEach(field => {
					if (field.idCustomField == "5d9239e35727f464345c44e4"){
						tempsres = field.value.number
					} else if (field.idCustomField == "5d9239313f6ac6712c0defbb"){
						var temp = new Date(field.value.date)
						ouverture = Math.round(temp.getTime()/(1000*60))						
					}
				});
				return {
					text: tempsres ? "Temps estimé avant la fin du problème : \n" + (ouverture + parseInt(tempsres) - now) + " minutes" : ouverture ? "Aucun estimé" : null,
					color : tempsres ? (ouverture + parseInt(tempsres) - now) >= 0 ? "orange" : "red" :
										ouverture ? "blue" : null,
					refresh : 10
				}		
			})			
		}	
	}]
}

TrelloPowerUp.initialize({
  // Start adding handlers for your capabilities here!
	 'card-buttons': function(t, options) {
	 return t.card("all")
	 .then(function(card){
	 	  	return [{
	 			icon: BLACK_ROCKET_ICON,
	 			text: 'Do not click',	       	
	 	  }];
	 })
	 },

	'card-badges': function(t, options){
			return getFrontBadges(t)
	},
	'card-detail-badges' : function(t, options){
		return getFrontBadges(t)
	},
	'board-buttons': function(t, options){
		return[{
			icon: TERAXION_ICON,
			text: 'Nouvelle demande',	
			url: 'http://192.168.5.165/DemandeSupport/',	
		}]	
	},
});
