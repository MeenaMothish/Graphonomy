


$(document).ready(function(){

	$("#Note-pill").click(function(){

		var sourceArr = [];
		var noteJsonArr = null;		
		var noteClassSearch = null;

		//Reading json file using getJson method & making the GET calls to run searches
		$.getJSON('json/metaspec.json',function(notejson){
				        
	        (function(){
	        	 noteJsonArr = notejson.noteClasses;

	        	 //storing the auto-completion options in sourceArr array
				 for (var i=0; i < noteJsonArr.length; i++){
			  		 sourceArr.push(noteJsonArr[i].noteId);
	          		}

	          		//Adding 'All' to the auto-completion options
	          		sourceArr.splice(0,0,"All");
	          		

	          		//Can.Model begins here

	        	  noteClassSearch = can.Model({
					findAll: 'GET /note_classes',
					findOne: 'GET /note_classes/{id}',
					create:  'POST /note_classes',
					update:  'PUT /note_classes/{id}',
					destroy: 'DELETE /note_classes/{id}'
				}, {});

					can.fixture('GET /note_classes', function(){
							return noteJsonArr;
						});

					can.fixture('GET /note_classes/{id}', function(request){
						return noteJsonArr[(+request.data.id)-1];
					});
					// Can.Model ends here



					$("#noteClass_SearchBtn").on('click', function(e){
						
						var SearchVal = document.getElementById("noteClass_SearchBox").value;
						var SearchValId = null;

						document.getElementById("note_results").innerHTML = "";
						document.getElementById("noteResults").style.visibility = "visible";
						
						

						//Can.View for rendering search results onto the HTML page	


						//Searching for 'All'
						if ((SearchVal !== null) && (SearchVal == "All")){		
							var NoteResultsArr;	
							noteClassSearch.findAll( {}, function(data){
								NoteResultsArr = [];

								for (var i =0; i<data.length; i++){
										NoteResultsArr.push(data[i]._data);  //storing the results for 'All' search in an array
									}
									
								var NoteClassView = can.view('views/NoteClassView.ejs', NoteResultsArr);
								document.getElementById("note_results").appendChild(NoteClassView);

							})
						}
						
						//Searching for a specific Note Class

						else if(SearchVal != null) {
							var NoteResultsArr = [];
							//finding the 'id' corresponding to the 'noteId' that is being searched for
							for (var i =0; i< noteJsonArr.length; i++){
								if(noteJsonArr[i].noteId == SearchVal)  {
									SearchValId = noteJsonArr[i].id;
									break;
								}
							}
							noteClassSearch.findOne( {id: SearchValId}, function(data){
								NoteResultsArr.push(data._data); //storing the results for search of specific noteId
								var NoteClassView = can.view('views/NoteClassView.ejs', NoteResultsArr);
								document.getElementById("note_results").appendChild(NoteClassView);								
							}); 		

						}
						
					});
	
				})();
			});


			//Adding the source for typeahead to the search text box
			$("#noteClass_SearchBox").typeahead({
			  	source: sourceArr
				});

			
			//Clearing the table of Note class results, if the text box value is changed.
		$("#noteClass_SearchBox").on('change',function(e){
			    document.getElementById("note_results").innerHTML = "";

		});
			
	});
	

});



		
