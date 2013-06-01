com.clinsoftsolutions.tabs
==========================

Alloy tabs widget that is cross platform and manages it's own stack. The starting point for this project was Mark Congrove's work at https://github.com/mcongrove/ChariTi with the com.chariti.tabs widget.

This widget now encapsulates all the management code within the widget itself and so makes it easier to use in new projects. Also it allows some deeper customisations in the views used and better handling of detail screens on iPads and other tablets.

__This is currently in development__

## Add as submodule to your project

    cd /path/to/your/appcelerator_project
    # The structure of this line is important. Git won't let you add submodules unless you are at the top level so we need to specify a clone location
    git submodule add git@github.com:ClinicalSoftwareSolutions/com.clinsoftsolutions.tabs.git ./app/widgets/com.clinsoftsolutions.tabs
    git commit -m "Added the Clinical Software Solutions Tabs widget"

    git submodule init
    git submodule update

To update the module. cd into the submodule directory
    git pull

Or to pull on all your submodules
    git submodule foreach 'git pull origin master'

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

In config.json set the config colours. This can be global or per platform

    "global": {
        "colours": {
            "primary": "#0000ff",
            "secondary": "#9999ff",
            "text": "#FFF"
        }
    },

Also add the dependancy
    "dependencies": {
        "com.clinsoftsolutions.tabs": "1.*",
    ...

In alloy.js

    var APP = Alloy.Globals.APP = {
        MainWindow: null,
        GlobalWrapper: null,
        ContentWrapper: null,
        Tabs: null,

        init: function() {
           APP.Tabs.init({
		     tabs: [
					{ id: 0, title: 'Home', image: "/icons/home.png", controller: "home" },
					{ id: 1, title: 'View', image: "/icons/view.png", controller: "mainview" },
					{ id: 2, title: 'Settings', image: "/icons/gear.png", controller: "settings" }
				],
		     view: APP.ContentWrapper,
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

