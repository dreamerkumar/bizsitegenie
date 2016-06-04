'use strict';

/*
* http://codepen.io/estrepitos/pen/JAtKr
*/
angular.module('shared-components').directive('sharedComponentsDelete', function(){

	return {
		restrict: 'E',
		scope: {
			onDeleteHandler: '&',
			deleteItem: '='
		},
		replace: true,
		templateUrl: 'shared/public/modules/shared-components/views/shared-components.delete.directive.view.html',
		controller: function($scope, $timeout){

			$scope.onDeleteClick = function($event){
				$scope.clickedOnDeleteButton = true;
				$event.preventDefault();
				$scope.trackingYesOrNo = true;

				//close the dialog if user waits too long to say yes or no
				$timeout(function(){
					if($scope.trackingYesOrNo){
						$scope.trackingYesOrNo = false;
						$scope.clickedOnDeleteButton = false;
					}
				}, 2000);
			};

			$scope.onCancel = function($event){
				$scope.clickedOnDeleteButton = false;
				$event.preventDefault();
				$event.stopPropagation();
				$scope.trackingYesOrNo = false;
			};

			$scope.onConfirm = function($event){
				$scope.loading = true;
				$event.stopPropagation();
				$event.preventDefault();
				$scope.trackingYesOrNo = false;
				if($scope.onDeleteHandler){
					$scope.onDeleteHandler({itemToDelete: $scope.deleteItem});
				}
			};
		},
		link: function(scope, element, attrs){

			// 	.click(function(){
			// 	if(!$(this).hasClass('selected')){
			// 		$(this).addClass('selected');
			// 		var owner = $(this);
					
			// 		$(this).find('.cancel').unbind('click').bind('click',function(){
			// 			owner.removeClass('selected');
			// 			return false;
			// 		})
					
			// 		$(this).find('.confirm').unbind('click').bind('click',function(){
			// 			$(this).parent().addClass('loading');
			// 			var parent = $(this).parent();
						
			// 			//ajax to delete
						
			// 			setTimeout(function(){ //On success
			// 				parent.addClass('deleted');
			// 				setTimeout(function(){
			// 					owner.fadeOut(600);
								
			// 					//remove item deleted
								
			// 					setTimeout(function(){
			// 						owner.find('.deleted').removeClass('loading').removeClass('deleted');
			// 						owner.removeClass('selected');
			// 						owner.show();
			// 					},1000)	
			// 				},1000)
			// 			},1000)
						
			// 			return false;
			// 		})
			// 	}		
			// 	return false;
			// });
		  
		  
		  // setTimeout(function(){
		  //   $('.delete').addClass('selected');
		  //   setTimeout(function(){
		  //      $('.deleteBox').addClass('loading'); 
		  //   	setTimeout(function(){
		  //       $('.deleteBox').addClass('deleted');
		  //       setTimeout(function(){
		  //         $('.delete').fadeOut(600,function(){
		            
		  //            $('.deleted').removeClass('loading').removeClass('deleted'); 
				// 			$('.delete').removeClass('selected');
		  //           setTimeout(function(){
		  //             $('.delete').show();
		  //           },500)
							
		            
		  //         });
		 
		          
		          
		  //       },500)
		        
		  //     },1000)
		  //   },1000)
		  // },500);    
		}
	};
});