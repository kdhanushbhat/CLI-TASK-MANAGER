The following program executes a basic task manager using the command line

External modules used:
-> It uses the 'file system' module of node to read from and write to files.
-> It uses the 'process' module for process information and stdout.write() function.
    The console.log() function was not able to pass the tests, hence used stdout.write()

Explanation of working:
The program first creates the contents of the file. Tasks are added to a list "task_list" that contains
the active tasks based on priority. Each task is stored in list and text files in the format
'priority  name_of_task'. The double space after priority is for easier splitting and priority comparison.
If task done, task is removed from the task_list and placed to the complete_list by adding it to the end.
For 'report' and 'ls' commands, the lists are read and information is printed accordingly.

Important:
The command worked with a double slash(.\\task) on my computer. Please try with the same if .\task dosent work.
#   C L I - T A S K - M A N A G E R  
 