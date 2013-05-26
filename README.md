com.clinsoftsolutions.tabs
==========================

Alloy tabs widget that is cross platform and manages it's own stack

This is currently in development.

##TODO

- Handle master detail screens


## Usage

This is a suggested construct for using the widget

In index.xml add:

    <Alloy>
	  <Window id="MainWindow" class="container">
		<View id="GlobalWrapper">
			<View id="ContentWrapper" />
			<Require type="widget" src="com.clinsoftsolutions.tabs" id="Tabs" />
		</View>
	  </Window>
    </Alloy>

In index.js

    var APP = Alloy.Globals.APP;	// GET THE SINGLETON
    APP.MainWindow = $.MainWindow;
    APP.GlobalWrapper = $.GlobalWrapper;
    APP.ContentWrapper = $.ContentWrapper;
    APP.Tabs = $.Tabs;		// Save the Tabs widget object
    APP.init();					// init the App

In alloy.js

    var APP = Alloy.Globals.APP = {
        init: function() {
           APP.Tabs.init({
		     tabs: [
					{ id: 0, title: 'Home', image: "/icons/home.png", controller: "home" },
					{ id: 1, title: 'View', image: "/icons/view.png", controller: "mainview" },
					{ id: 2, title: 'Settings', image: "/icons/gear.png", controller: "settings" }
				],
		     view: APP.ContentWrapper,
		     colors: {
			     primary: '#ff3333',
			     secondary: '#3333ff',
			     text: '#111'
		        }
			  });

			APP.MainWindow.open();
			APP.Tabs.handleNavigation(0);
			}
    }

This from within any other controller. First get the APP singleton (actually this is mainly convenient)

    var APP = Alloy.Globals.APP;

Then manipulate the tab stack using:

Programatically change tabs

    APP.Tabs.handleNavigation(<<id of tab>>);

Add a child to the current tab stack

    APP.Tabs.addChild("<<controller name>>", {<<dict of params>>});

Close the top-most view in a stack

    APP.Tabs.removeChild();
