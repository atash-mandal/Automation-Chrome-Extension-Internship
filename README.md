# HPE-Internship
# UI Framework Automation

This is a record and play tool. Functionalities it provides are --->
* Users can record their interactions on a browser and can play the recorded steps.
* It can run the sae set of commands for multiple times. There is a iteration box provided for the number of iterations users want to perform
* Pause button is there. It can be used to pause or resume the playback anytime.
* Recod button is available. Clicking on that will popup a new tab in a new window having the base url as recorded automatically. Users can do whatever they want on the tab. Interactions will get recorded and will be show in a tabular format.
* Speed Selector is available. It can be used to change the speed of the playback.

**UI interface**

   <img width="543" alt="image" src="https://media.github.hpe.com/user/72463/files/80bf4e3a-ffa4-4197-9ddc-bb2142aada6d">

**Architecture**

* Recording Architecture

  <img width="529" alt="image" src="https://media.github.hpe.com/user/72463/files/4264d693-d7f8-420a-b43b-87c774242f48">

* Playback Architecture

  <img width="582" alt="image" src="https://media.github.hpe.com/user/72463/files/71f3a4df-d813-47d3-9a72-dbc0fa9020e1">
  
**Workflow**

When clicked on the extension icon in the browser, a popup will open with the base url as the current tab url.

*Recording*
On clicking the recording button, it creates a new window with the base url for recording purpose. Again clicking on the record button, recording is stopped and no further interactions are recorded.

*Playback*

On clicking the play button, it creates a new window with the base url for playback purpose. Again clicking on the record button, the playback is aborted.

*Pause*

On clicking the pause button, it stops instruction sending to playback window. Again clicking on pause button it resumes the playback from where it is paused.

*Speed Selector*

The speed selector is nothing but the delay in miliseconds after which the next command will be sent during playback. There are 5 speed levels ---> 1(5000), 2(4000), 3(3000), 4(2000), 5(5000) in miliseconds. The default speed is kept at 5(fastest)

*Iteration*

Separate input box is given to run same set of code multiple times. Users can specify the number of iterations they want to perform and the playback will run for the given number of times.

*Open File*

With this button, users can open pre-recorded steps from their local storage

*Download File*

With this button, users can download their recorded steps in local storage for future use. The file is save in a json format.

*File Name*

Name of the file will be displayed at the top left corner when a file is opened. By default, it is ---> New Project.

**Rules for Selectors**

selector format --->      [data-test-id / class / id] || xpath  

* Xpath is not necessary to be there, but it is kept in case if it fails to fetch element by the data-test-id / class / id selectors, xpath will be used to get the element and it both ways it fails, it will stop playback and show $\color{red}{"Test Failed"}$
* If the target element does not have "data-test-id" or "data-testid" as attribute, it will go for its parent node and so on and selector will look like ---> data-test-id/[1]/[0]... Same goes for the class and id selectors
* Replace intermediate white spaces(" ") in between the selectors with slash ("/")
* If the target element is present inside a shadow root in either block storage or dom, prepend {block} / {dom} to the selectors
* If the target element is present inside a iframe, prepend "*" to the selectors












