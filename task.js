import * as fs from 'fs'
import { stdout } from 'process'

const arg_list = process.argv.slice(2,)                                                                                                                       
const task_path = process.cwd()+"\\task.txt"                                         // Variable for path of the task.txt file    
const complete_path = process.cwd()+"\\completed.txt"                                // Variable path for the completed.txt file
let task_list = []                                                                   //List of active tasks
let complete_list = []                                                               //List of completed tasks

const files_exist = () =>{                                                              //Function that checks for the existence of the
    if (fs.existsSync(task_path) && fs.existsSync(complete_path))                       // task.txt and completed .txt files
        return true                                                                     //creates these files if not present
    else{
        fs.open(task_path,"w",()=>{})
        fs.open(complete_path,"w",()=>{})
        return false
    }
}

const get_contents = () =>{                                                                         //function that reads the contents of the text files
    if(files_exist()){          
        let list1 = (fs.readFileSync(task_path,{encoding:'utf8', flag:'r'})).split("\r\n")
        let list2 = (fs.readFileSync(complete_path,{encoding:'utf8', flag:'r'})).split("\r\n")
        if (list1.length == 1 && list1[0] == '')                                                    //assigns empty list if files just created, removes
            task_list = []                                                                          //the empty string "" added to the file on creation
        else   
            task_list = list1
        if (list2.length == 1 && list2[0] == '')
            complete_list = []
        else
            complete_list = list2
    }
    else{                                                                                            //assigns empty list if files absent
        task_list=[]
        complete_list=[]
    }
}

const add_task_contents = (list,path) =>{                                                              //converts the task list passed through arguments
    let buf = ""                                                                                       //into a string and saves in the file provided through the path
    for(let i of list){
        buf+=i+"\r\n"
    }
    buf = buf.slice(0,-2)
    fs.writeFileSync(path,buf)
}

const print_help = () =>{                                                                                           // help string
    var help_text="Usage :-\n\
$ ./task add 2 hello world    # Add a new item with priority 2 and text \"hello world\" to the list\n\
$ ./task ls                   # Show incomplete priority list items sorted by priority in ascending order\n\
$ ./task del INDEX            # Delete the incomplete item with the given index\n\
$ ./task done INDEX           # Mark the incomplete item with the given index as complete\n\
$ ./task help                 # Show usage\n\
$ ./task report               # Statistics"
    stdout.write(help_text)
}

const print_report = () =>{                                                                                 //prints the task report 
    get_contents()                                                                                          //inital condition to print 0, if task list are empty
    if (task_list.length==0){
        console.log(`Pending : 0\n`)
    }
    else{
        console.log(`Pending : ${task_list.length}`)
        for (let i in task_list){
            let task = task_list[i].split('  ')
            console.log((parseInt((i),10)+1)+".",`${task[1]} [${task[0]}]`)
        }
    }
    if (complete_list.length==0){
        console.log(`\nCompleted : 0\n`)
    }
    else{
        console.log(`\nCompleted : ${complete_list.length}`)
        for (let i in complete_list){
            let task = complete_list[i].split('  ')
            console.log((parseInt((i),10)+1)+".",`${task[1]}`)
        }   
    }
}

const add_task = (priority,name) => {                                                                       // adds task to the task list based on priority
    get_contents()                                                                                          //prints required confirmation messages
    if (task_list.length==0){
        task_list.unshift(`${priority}  ${name}`)
        console.log(`Added task: "${name}" with priority ${priority}`)
        add_task_contents(task_list,task_path)
        return
    }
    let i = 0
    while (i<task_list.length){
        if (task_list[i].split('  ')[0]>priority)
            break
        i+=1;
    }
    console.log(`Added task: "${name}" with priority ${priority}`)
    task_list.splice(i,0,`${priority}  ${name}`)
    add_task_contents(task_list,task_path)
}

const task_done = (index) =>{                                                                                // transfers the completed tasks from the active task list
    get_contents()                                                                                           //to the completed task list based on index
    if (index<1 || index>task_list.length){
        console.log(`Error: no incomplete item with index #${index} exists.`)
        return
    }
    complete_list.push(task_list[index-1])
    task_list.splice(index-1,1)
    console.log("Marked item as done.")
    add_task_contents(task_list,task_path)
    add_task_contents(complete_list,complete_path)
}

const delete_task = (index) =>{                                                                              //deletes the task from the active task list based on index
    get_contents()
    if (index<1 || index>task_list.length){
        console.log(`Error: task with index #${index} does not exist. Nothing deleted.`)
        return
    }
    console.log(`Deleted task #${index}`)
    task_list.splice(index-1,1)
    add_task_contents(task_list,task_path)
}

const print_tasks = ()=>{                                                                                  // prints the active tasks for the 'ls' command based on priority
    get_contents()
    if (task_list.length == 0){
        console.log("There are no pending tasks!")
        return
    }
    for (let i in task_list){
        let task = task_list[i].split('  ')
        console.log((parseInt((i),10)+1)+".",`${task[1]} [${task[0]}]`)
    }
}

if (arg_list.length == 0)                                                                                //driver if-else-if block that calls the necessary
    print_help()                                                                                         // functions based on the arguments and provide
else if (arg_list[0] == "add"){                                                                          // error messages for missing arguments
    if (arg_list.length < 3)
        console.log('Error: Missing tasks string. Nothing added!')
    else
        add_task(arg_list[1],arg_list[2])
}
else if(arg_list[0] == "del"){
    if (arg_list.length<2)
        console.log("Error: Missing NUMBER for deleting tasks.")
    else   
    delete_task(arg_list[1])
}
else if(arg_list[0] == "done"){
    if (arg_list.length<2)
        console.log("Error: Missing NUMBER for marking tasks as done.")
    else   
    task_done(arg_list[1])
}
else if (arg_list.length == 1){
    if(arg_list[0] == "help")
        print_help()
    else if(arg_list[0] == "report")
        print_report()
    else if(arg_list[0] == "ls")
        print_tasks()
}