'use strict';

//Manages the list of items for a given item
angular.module('items').factory('ItemItems', ['ItemItemsPersist',
	function(ItemItemsPersist) {
		var indexIncrement = 10000;
		return {
			positionIndex: 0,

			list: [],

			/*
			* Important to call this on page load 
			*/
			initialize: function(existingList){
				this.list = [];
			
					existingList.forEach(function(persistedItem){
						this.add(persistedItem.type, persistedItem.id, persistedItem.positionIndex, persistedItem.label, persistedItem.options);
					}.bind(this));
				
				return this.getList();
			},

			getPositionIndexForNewlyInsertedItem: function(index){
				var nextElementPositionIndex, previousElementPositionIndex;
				if(this.list.length > index+1){
					nextElementPositionIndex = parseInt(this.list[index+1].positionIndex);
				}

				if(index > 0){
					previousElementPositionIndex = parseInt(this.list[index -1].positionIndex);
				} else {
					previousElementPositionIndex = 0;
				}

				if(nextElementPositionIndex) {
					return previousElementPositionIndex + parseInt((nextElementPositionIndex - previousElementPositionIndex)/2);
				} else {
					return previousElementPositionIndex + indexIncrement;
				}

			},

			add: function(itemType, entityId, itemPositionIndex, itemLabel, itemOptions, replaceObj, replaceAtIndex){

				this.positionIndex = itemPositionIndex;
				var entry = {
					id: entityId,
					type: itemType,
					editingLabel: false,
					positionIndex: itemPositionIndex,
					label: itemLabel || '',
					addingOption: '',
					newOptionText: '',
					options: itemOptions || [],

					getDisplayLabel: function(){
						if(this.doesLabelExist()){
							return this.label;
						} else {
							return 'Click to give a name';
						}
					},
					labelStatusClass: function(){
						if(this.doesLabelExist()){
							return 'label-exists';
						} else {
							return 'add-a-label';
						}
					},
					doesLabelExist: function(){
						return this.label && this.label.length > 0;
					},
					changeToEditLabelMode: function(){
						this.editingLabel = true;
					},
					saveItemLabel: function(){
						var entity = ItemItemsPersist.updateLabel(this.id, this.label, this.type, function(success, err){
							if(success){
								this.editingLabel = false;
							} else {
								console.error(err);
							}
						}.bind(this));						
					},
					savePositionIndex: function(){
						var entity = ItemItemsPersist.updatePositionIndex(this.id, this.positionIndex, this.type, function(success, err){
							if(success){
								console.log('position index successfully updated');
							} else {
								console.error(err);
							}
						}.bind(this));						
					},

					getOptionDisplayLabel: function(){
						switch(this.type){
							case 'radioButtons':
								if(this.options && this.options.length > 0){
									return 'Click to add more options';
								}
								return 'Click to add an option to choose';								
							case 'dropDown':
								if(this.options && this.options.length > 0){
									return 'Click to add more values to this dropdown';
								}
								return 'Click to add a selection value to this dropdown';
							default:
								throw 'Invalid object type';
						}						
					},
					optionAdditionStatusClass: function(){
						if(this.options && this.options.length > 0){
							return 'label-exists';
						} else {
							return 'add-a-label';
						}
					},
					changeToAddOptionMode: function(){
						this.newOptionText = '';
						this.addingOption = true;
					},
					addOption: function(){
						var entity = ItemItemsPersist.addOption(this.id, this.newOptionText, this.type, function(newOption, err){
							if(newOption){
								if(!this.options){
									this.options = [];
								}
								this.options.push({text: newOption.text, value: newOption.value, id: newOption._id});
								this.addingOption = false;
								this.newOptionText ='';
							} else {
								console.error(err);
							}
						}.bind(this));						
					}
				};
				if(replaceObj){
					this.list[replaceAtIndex] = entry;
				} else {
					this.list.push(entry);
				}
				return this.positionIndex;
			},

			removeAt: function(index){
				this.list.splice(index, 1);
			},

			getList: function(){
				return this.list;
			},

			getNewPropertyName: function(){
				var maxCtr = 0;
				this.list.forEach(function(item){
					if(item.label){
						var label = item.label.toLowerCase();
						if(label.indexOf('property') === 0 && label.length > 8){
							var rest = label.substring(8);
							rest = rest.replace(/\D/g, '');
							if(rest.length > 0){
								var val = Number(rest);
								if(val && val > maxCtr){
									maxCtr = val;
								}
							}
						}
					}
				});
				var ctr = maxCtr+1;
				return 'Property' + ctr;
			}
		};	
	}
]);