# Bhoomi-Internship
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

When clicked on the extension icon in the browser, a popup(main.html) will open with the base url as the current tab url. The main js then sends a message to the background $\color{green}{msg: "Main.js"}$. The background js then receives the message and gets the main tab Id and stores it for further actions.

*Recording*
* On clicking the recording button, main js creates a new window with the base url for recording purpose and sends a message $\color{green}{msg:"Start\ Recording!"}$ to background js, the background then sets the variable rec = "start". Again clicking on the record button, main js sends a message $\color{green}{msg:"Stop\ Recording!"}$ and the background sets the variable rec = "stop" and no other interactions are recorded.
* When the new recording window is created, it sends a message $\color{green}{msg: "Main\ content"}$ and the background js gets the recording tab Id. The interactions such as click event, keyboard, window size change, close / quit are send as message $\color{green}{msg: "data",\ target: locator\ generated,\ value: text-value}$. The background js after receiving the message verifies if it is sent from the recording window. If it is from recording window, it sends a message $\color{green}{msg: "verified\ data",\ target: locator\ generated,\ value: text-value}$ to the min tab and it is recorded as a step.

*Playback*

* On clicking the play button, main js sends a message $\color{green}{msg:"runWin"}$ to background js, the background then sets the variable run = "run" and main js then creates a new window with the base url for playback purpose . Again clicking on the record button, main js sends a message $\color{green}{msg:"Stop\ Recording!"}$ and the background sets the variable rec = "stop" and no other interactions are recorded.
* The new playback window once created sends a message $\color{green}{msg: "Main\ content"}$ and the background js gets the playback tab Id. It then sets a interval that sends the command to the playback window at a fixed delay depending on the speed selector until it is executed.
* The playback window on receiving the commands tries to find the element and if it is present it executes the command and sends a message $\color{green}{msg: "found"}$ and the background js after receiving this message sends another message to the main tab $\color{green}{msg: "next"}$ for the next command.

*Pause*

On clicking the pause button, a message $\color{green}{msg: "Pause Running"}$ is sent from main js and background on receiving it changes variable pause = "pause" and stops instruction sending to playback window. Again clicking on pause button a message $\color{green}{msg: "Resume Running"}$ is sent and background now sets pause = "resume" and resumes the playback.

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












