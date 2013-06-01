/**
 * The stack controller
 */
$.STACK = {
	currentStack: -1,
	previousScreen: null,
	controllerStacks: [],
	modalStack: [],
	hasDetail: false,
	currentDetailStack: -1,
	previousDetailScreen: null,
	detailStacks: [],
	Master: [],
	Detail: []
};

$.ContentView = null;
$.MainWindow = null;

/**
 *
 */
$.init = function(_params) {
	$.ContentView = _params.view;
	if(!$.ContentView) { Ti.API.error("TABS Widget - A view to place content into must be passsed.");}

	$.MainWindow = _params.window;
	if(!$.MainWindow) { Ti.API.error("TABS Widget - The main window of the application must be passsed.");}

	$.tabs			= [];
	$.currentTab	= 0;
	$.excess		= false;
	$.excessLength	= 5;
	$.moreOpen		= false;
	$.width			= 0;
	$.display		= {
		width:	Ti.Platform.displayCaps.platformWidth > Ti.Platform.displayCaps.platformHeight ? Ti.Platform.displayCaps.platformHeight : Ti.Platform.displayCaps.platformWidth,
		height:	Ti.Platform.displayCaps.platformWidth > Ti.Platform.displayCaps.platformHeight ? Ti.Platform.displayCaps.platformWidth : Ti.Platform.displayCaps.platformHeight,
		dpi:	Ti.Platform.displayCaps.dpi
	};

	if(_params.tabs.length === 0) {
		Ti.API.error("Nothing to init tabs with");
		return;
	}
	else {
		$.TAB_PARAMS = _.clone(_params.tabs);
	}

	if(OS_ANDROID) {
		$.display.width		= ($.display.width / ($.display.dpi / 160));
		$.display.height	= ($.display.height / ($.display.dpi / 160));
	}

	if(Alloy.isTablet) {
		$.excessLength = Math.floor($.display.width / 70);
	}

	if(_params.tabs.length > $.excessLength) {
		$.excess = true;
	}

	$.width	= $.excess ? Math.floor($.display.width / $.excessLength) : Math.floor($.display.width / _params.tabs.length);

	// Check if property exists, then account for values such as 50dp
	if (_params.bottom && parseInt(_params.bottom.toString()) > 0) {
		$.Wrapper.bottom = _params.bottom;
	}

	if(Alloy.CFG.colours) {
		$.ColourPrimary = Alloy.CFG.colours.primary || "#2600ff";
		$.ColourSecondary = Alloy.CFG.colours.primary || "#0090ff";
		$.ColourText = Alloy.CFG.colours.text || "#fff";
	}

	$.TabGroup.backgroundColor			= $.ColourPrimary;
	$.TabContainerMore.backgroundColor	= $.ColourPrimary;
	$.Indicator.backgroundColor			= $.ColourSecondary;
	$.IndicatorMore.backgroundColor		= $.ColourSecondary;

	$.IndicatorContainer.width		= $.display.width + "dp";
	$.Indicator.width				= ($.width - 1) + "dp";
	$.IndicatorMore.width			= $.width + "dp";
	$.TabContainer.width			= $.display.width + "dp";
	$.TabGroupMore.width			= $.display.width + "dp";
	$.TabContainerMore.width		= ($.width + 1) + "dp";

	for(var i = 0; i < _params.tabs.length; i++) {
		if($.excess && i == ($.excessLength - 1)) {
			$.addMoreTab(_params);
		}

		var tab = Ti.UI.createView({
			id: _params.tabs[i].id,
			width: $.width + "dp",
			height: "60dp",
			top: "0dp",
			left: "0dp"
		});

		var icon = Ti.UI.createImageView({
			image: _params.tabs[i].image,
			width: "32dp",
			height: "32dp",
			top: "7dp",
			touchEnabled: false,
			preventDefaultImage: true
		});

		var label = Ti.UI.createLabel({
			text: _params.tabs[i].title,
			top: "42dp",
			left: "5dp",
			right: "5dp",
			width: Ti.UI.FILL,
			height: "15dp",
			font: {
				fontSize: "11dp",
				fontWeight: "bold"
			},
			shadowColor: "#000",
			shadowOffset: {
				x: "0dp",
				y: "1dp"
			},
			color: $.ColourText,
			textAlign: "center",
			touchEnabled: false
		});

		tab.add(icon);
		tab.add(label);

		if($.excess && i >= ($.excessLength - 1)) {
			tab.backgroundImage = WPATH("images/overlay.png");
			tab.width	= ($.width + 1) + "dp";
			label.left	= "6dp";

			var border = Ti.UI.createImageView({
				width: "1dp",
				height: "59dp",
				top: "1dp",
				left: "0dp",
				image: WPATH("images/border.png"),
				preventDefaultImage: true
			});

			tab.add(border);

			$.tabs.push(tab);

			$.TabsMore.add(tab);
		} else {
			if((i + 1) < _params.tabs.length) {
				var border = Ti.UI.createImageView({
					width: "1dp",
					height: "59dp",
					top: "1dp",
					right: "0dp",
					image: WPATH("images/border.png"),
					preventDefaultImage: true
				});

				tab.add(border);
			}

			$.tabs.push(tab);
		}
	}

	for(var i = 0, z = $.excessLength; i < z; i++) {
		if($.tabs[i]) {
			$.Tabs.add($.tabs[i]);
		}
	}

	// Add a handler for the tabs
	$.Wrapper.addEventListener("click", function(_event) {
	if(typeof _event.source.id !== "undefined" && typeof _event.source.id == "number") {
		if ($.currentTab != _event.source.id) {
			$.currentTab = _event.source.id;
			Ti.API.debug("Tab widget change to id: " + _event.source.id);
			Ti.App.fireEvent('app:Tabs:Change', {id: _event.source.id});
			$.handleNavigation( $.currentTab );
		}
	}
	});

	if(OS_ANDROID) {
		$.MainWindow.addEventListener("androidback", $.backButtonHandler);
	}

};

$.addMoreTab = function(_params) {
	var tab = Ti.UI.createView({
		width: $.width + "dp"
	});

	var icon = Ti.UI.createImageView({
		image: "/icons/more.png",
		width: "32dp",
		height: "32dp",
		top: "7dp",
		touchEnabled: false,
		preventDefaultImage: true
	});

	var label = Ti.UI.createLabel({
		text: "More",
		top: "43dp",
		left: "5dp",
		right: "5dp",
		width: Ti.UI.FILL,
		height: "13dp",
		font: {
			fontSize: "11dp",
			fontWeight: "bold"
		},
		shadowColor: "#000",
		shadowOffset: {
			x: "0dp",
			y: "1dp"
		},
		color: $.ColourText,
		textAlign: "center",
		touchEnabled: false
	});

	tab.add(icon);
	tab.add(label);

	tab.addEventListener("click", $.moreEvent);

	$.tabs.push(tab);
};

$.clear = function() {
	var children		= $.Tabs.children;
	var childrenMore	= $.TabsMore.children;

	for(var i = 0; i < children.length; i++) {
		$.Tabs.remove(children[i]);
	}

	for(var i = 0; i < childrenMore.length; i++) {
		$.TabsMore.remove(childrenMore[i]);
	}
};

$.setIndex = function(_index) {
	if($.excess && _index > ($.excessLength - 2)) {
		_moreIndex	= _index - ($.excessLength - 1);
		_index		= ($.excessLength - 1);

		$.IndicatorMore.visible = true;
		$.IndicatorMore.top		= ((_moreIndex * 60)) + "dp";
	} else {
		$.IndicatorMore.visible = false;
	}

	$.Indicator.left	= (_index * $.width) + "dp";
	$.Indicator.width	= $.width + "dp";

	$.moreClose();
};

$.moreEvent = function(_event) {
	 if($.moreOpen) {
	 	$.Wrapper.height = "60dp";

	 	$.moreOpen = false;
	 } else {
	 	$.moreOpen = true;

	 	$.Wrapper.height = Ti.UI.SIZE;
	 }
};

$.moreClose = function() {
	$.Wrapper.height	= "60dp";
	$.moreOpen			= false;
};

$.Wrapper.addEventListener("click", function(_event) {
	if(typeof _event.source.id !== "undefined" && typeof _event.source.id == "number") {
		$.setIndex(_event.source.id);
	}
});

/**
 * Global event handler to change screens
 * @param {String} [_id] The ID (index) of the tab being opened
 */
$.handleNavigation = function(_id) {
	Ti.API.debug("Tabs.handleNavigation | " + $.TAB_PARAMS[_id].controller);

	// Requesting same screen as we're on
	if(_id == $.STACK.currentStack) {
		// Do nothing
		return;
	} else {
		// Move the tab selection indicator
		$.setIndex(_id);

		// Fire hook saying tab about to change
		// This originally Closes any loading screens
		// APP.closeLoading();
		Ti.App.fireEvent("app:TabChanging", {index: _id, previousIndex: $.STACK.currentStack});

		// Set current stack
		$.STACK.currentStack = _id;

		// Create new controller stack if it doesn't exist
		if(typeof $.STACK.controllerStacks[_id] === "undefined") {
			$.STACK.controllerStacks[_id] = [];
		}

		if(Alloy.isTablet) {
			$.STACK.currentDetailStack = _id;

			if(typeof $.STACK.detailStacks[_id] === "undefined") {
				$.STACK.detailStacks[_id] = [];
			}
		}

		// Set current controller stack
		var controllerStack = $.STACK.controllerStacks[_id];

		// If we're opening for the first time, create new screen
		// Otherwise, add the last screen in the stack (screen we navigated away from earlier on)
		var screen;

		$.STACK.hasDetail = false;
		$.STACK.previousDetailScreen = null;

		if(controllerStack.length > 0) {
			// Retrieve the last screen
			if(Alloy.isTablet) {
				screen = controllerStack[0];

				if(screen.type == "tablet") {
					$.STACK.hasDetail = true;
				}
			} else {
				screen = controllerStack[controllerStack.length - 1];
			}

			// Tell the parent screen it was added to the window
			if(controllerStack[0].type == "tablet") {
				controllerStack[0].fireEvent("APP:tabletScreenAdded");
			} else {
				controllerStack[0].fireEvent("APP:screenAdded");
			}
		} else {
			// Create a new screen
			var controller = $.TAB_PARAMS[_id].controller.toLowerCase();

			screen = Alloy.createController(controller, $.TAB_PARAMS[_id]).getView();

			// Add screen to the controller stack
			controllerStack.push(screen);

			// Tell the screen it was added to the window
			if(screen.type == "tablet") {
				screen.fireEvent("APP:tabletScreenAdded");
			} else {
				screen.fireEvent("APP:screenAdded");
			}
		}

		// Add the screen to the window
		$.addScreen(screen);

		// Reset the modal stack
		$.modalStack = [];

		Ti.App.fireEvent("app:TabChanged", {index: _id});
	}
}

/**
 * Open a child screen
 * @param {String} [_controller] The name of the controller to open
 * @param {Object} [_params] An optional dictionary of parameters to pass to the controller
 * @param {Boolean} [_modal] Whether this is for the modal stack
 */
$.addChild = function(_controller, _params, _modal) {
		var stack;

		// Determine if stack is associated with a tab
		if(_modal) {
			stack = $.STACK.modalStack;
		} else {
			if(Alloy.isHandheld || !$.STACK.hasDetail) {
				stack = $.STACK.controllerStacks[$.STACK.currentStack];
			} else {
				stack = $.STACK.detailStacks[$.STACK.currentDetailStack];
			}
		}

		// Create the new screen controller
		var screen = Alloy.createController(_controller, _params).getView();

		// Add screen to the controller stack
		stack.push(screen);

		// Add the screen to the window
		if(Alloy.isHandheld || !$.STACK.hasDetail || _modal) {
			$.addScreen(screen);
		} else {
			$.addDetailScreen(screen);
		}
}

/**
 * Removes a child screen
 * @param {Boolean} [_modal] Removes the child from the modal stack
 */
$.removeChild = function(_modal) {
		var stack;

		if(_modal) {
			stack = $.STACK.modalStack;
		} else {
			if(Alloy.isTablet && $.STACK.hasDetail) {
				stack = $.STACK.detailStacks[$.STACK.currentDetailStack];
			} else {
				stack = $.STACK.controllerStacks[$.STACK.currentStack];
			}
		}

		var screen = stack[stack.length - 1];
		var previousStack;
		var previousScreen;

		stack.pop();

		if(stack.length === 0) {
			previousStack = $.STACK.controllerStacks[$.STACK.currentStack];

			if(Alloy.isHandheld || !$.STACK.hasDetail) {
				previousScreen = previousStack[previousStack.length - 1];

				$.addScreen(previousScreen);
			} else {
				previousScreen = previousStack[0];

				if(_modal) {
					$.addScreen(previousScreen);
				} else {
					$.addDetailScreen(previousScreen);
				}
			}
		} else {
			previousScreen = stack[stack.length - 1];

			if(Alloy.isHandheld || !$.STACK.hasDetail) {
				$.addScreen(previousScreen);
			} else {
				if(_modal) {
					$.addScreen(previousScreen);
				} else {
					$.addDetailScreen(previousScreen);
				}
			}
		}
	}

/**
 * Removes all children screens
 * @param {Boolean} [_modal] Removes all children from the modal stack
 */
$.removeAllChildren = function(_modal) {
	var stack = _modal ? $.STACK.modalStack : $.STACK.controllerStacks[$.STACK.currentStack];

	for(var i = stack.length - 1; i > 0; i--) {
		stack.pop();
	}

	$.addScreen(stack[0]);
}

/**
 * Global function to add a screen
 * @param {Object} [_screen] The screen to add
 */
$.addScreen = function(_screen) {
	if(_screen) {
		$.ContentView.add(_screen);

		if($.previousScreen) {
			$.removeScreen($.previousScreen);
		}

		$.previousScreen = _screen;
	}
}

/**
 * Global function to remove a screen
 * @param {Object} [_screen] The screen to remove
 */
$.removeScreen = function(_screen) {
		if(_screen) {
			$.ContentView.remove(_screen);

			$.previousScreen = null;
		}
	}

/**
 * Adds a screen to the Master window
 * @param {String} [_controller] The name of the controller to open
 * @param {Object} [_params] An optional dictionary of parameters to pass to the controller
 * @param {Object} [_wrapper] The parent wrapper screen to fire events to
 */
$.addMasterScreen = function(_controller, _params, _wrapper) {
		var screen = Alloy.createController(_controller, _params).getView();

		_wrapper.addEventListener("APP:tabletScreenAdded", function(_event) {
			screen.fireEvent("APP:screenAdded");
		});

		$.STACK.Master[$.STACK.currentStack].add(screen);
	}

/**
 * Adds a screen to the Detail window
 * @param {Object} [_screen] The screen to add
 */
$.addDetailScreen =  function(_screen) {
		if(_screen) {
			$.STACK.Detail[$.STACK.currentStack].add(_screen);

			if($.STACK.previousDetailScreen && $.STACK.previousDetailScreen != _screen) {
				var pop = true;

				if($.STACK.detailStacks[$.STACK.currentDetailStack][0].type == "PARENT" && _screen.type != "PARENT") {
					pop = false;
				}

				$.removeDetailScreen($.STACK.previousDetailScreen, pop);
			}

			$.STACK.previousDetailScreen = _screen;
		}
	}

/**
 * Removes a screen from the Detail window
 * @param {Object} [_screen] The screen to remove
 * @param {Boolean} [_pop] Whether to pop the item off the controller stack
 */
$.removeDetailScreen = function(_screen, _pop) {
		if(_screen) {
			$.STACK.Detail[$.STACK.currentStack].remove(_screen);

			$.STACK.previousDetailScreen = null;

			if(_pop) {
				var stack = $.STACK.detailStacks[$.STACK.currentDetailStack];

				stack.splice(0, stack.length - 1);
			}
		}
	}

/**
 * Back button handler
 * @param {Object} _event Standard Titanium event callback
 */
$.backButtonHandler = function(_event) {
	if($.STACK.modalStack.length > 0) {
		$.removeChild(true);
		return;
	} else {
		var stack;

		if(Alloy.isHandheld || !$.STACK.hasDetail) {
			stack = $.STACK.controllerStacks[$.STACK.currentStack];
		} else {
			stack = $.STACK.detailStacks[$.STACK.currentDetailStack];
		}

		if(stack.length > 1) {
			$.removeChild();
		} else {
			$.MainWindow.close();
		}
	}
}

