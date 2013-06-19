/*---------------------------------------------------------------------------
Copyright 2013 Matthew McCall.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
---------------------------------------------------------------------------*/

exports.applyCommands = applyCommands;
exports.applyFnSET = applyFnSET;

function applyCommands (inputJSON) {

var arrayCommands = [
      {commandFullName:'BREAK', commandSyntax: 'BREAK:Postconditional', commandDescription: 'Stops execution of current process for debugging until signaled.'},
      {commandFullName:'CLOSE', commandSyntax: 'CLOSE:Postconditional Device:Parameters', commandDescription: 'Releases ownership of an i/o device. Close can also use device parameters to manipulate the device as it is released. If the current device is closed, the special variable $io will be empty or reset to a default value.'},
      {commandFullName:'DO', commandSyntax: 'DO:Postconditional Argument:Postconditional', commandDescription: 'Executes a subroutine, then returns control to the next command after the do; for multiple arguments, each subroutine in turn is executed. The line referenced in each argument must have a line level of one, or the do will cause error m14. Argumentless do executes the following block of code, with a line level one greater than the do’s line level, then returns.'},
      {commandFullName:'ELSE', commandSyntax: 'ELSE', commandDescription: 'Lets rest of the line execute only if $test evaluates to false.'},
      {commandFullName:'FOR', commandSyntax: 'FOR Variable=Parameters', commandDescription: 'Repeats execution of the rest of the line, and sets the value of a variable each time. Argumentless for repeats execution of the rest of the line without setting a variable. A quit or goto command terminates a for loop on the current line; quit terminates only the most recent in a series of nested for loops on the line, whereas goto terminates all active for loops on the line. Argument indirection not allowed.  Each for parameter defines a series of one or more values for the variable to accept, and executes the rest of the line once for each value in that series. Each for parameter can be either a single evaluated expression, or a range of numeric values. Ranges include a starting value, an increment with which to calculate subsequent values, and an optional maximum value. A for loop that runs out of values stops without needing a quit or goto.'},
      {commandFullName:'GOTO', commandSyntax: 'GOTO:Postconditional Reference:Postconditional', commandDescription: 'Transfers execution to a different line of code, without returning when that block of code completes. Trying to goto a line at a different line level, or trying to cross block boundaries when the goto’s line level is greater than one, causes error m45.'},
      {commandFullName:'HALT', commandSyntax: 'HALT:Postconditional', commandDescription: 'Ends the process. Releases all locked names, closes all opened devices, and aborts all active transactions. Halt never takes an argument.'},
      {commandFullName:'HANG', commandSyntax: 'HANG:Postconditional Expression', commandDescription: 'Suspends execution of the process for approximately the specified number of seconds. Negative numbers or zero do not stop execution. Hang always takes an argument.'},
      {commandFullName:'IF', commandSyntax: 'IF Expression', commandDescription: 'Lets the rest of the line execute only if all arguments evaluate to true; sets $test to whether the if succeeded. Argumentless if lets the rest of the line execute only if $test = 1. Note that because if with multiple arguments is identical to multiple, independent if commands, later arguments are evaluated only if earlier ones succeed.'},
      {commandFullName:'JOB', commandSyntax: 'JOB:Postconditional Argument:Parameters:Timeout', commandDescription: 'Makes an independent process that begins execution at the specified line of code. Timed job sets $test to whether the job command succeeded in the time specified. Note that the job command can only pass parameters by value; trying to pass by reference causes error m40.'},
      {commandFullName:'KILL', commandSyntax: 'KILL:Postconditional Argument', commandDescription: 'Removes specified variables, and all their array descendants. Argumentless kill removes all local variables, and their array descendants. An exclusive kill, a kill argument in the form of a parenthesized list of local variables, removes all local variables and their descendants, except those listed within the parentheses and their descendants.'},
      {commandFullName:'LOCK', commandSyntax: 'LOCK:Postconditional Argument:Timeout', commandDescription: 'Gets and/or releases ownership of names. Argumentless lock releases ownership of all names held by current process. Names, like devices, can only be owned by one process at a time. Ownership of a name includes all array descendants of that name. Locked names are logical names that look like local and global names for convenience only. A name used as an argument of a lock command does not change the naked reference, nor can it be referred to by the naked reference. Unlike devices, names can be used when not owned; locking is a voluntary signaling mechanism, not a method for preventing access. Locking a name does not prevent other processes from accessing or manipulating variables with the same names, only from successfully locking those names. Mumps code should voluntarily lock names, especially global names, whose simultaneous use by multiple processes would lead to problems, such as loss of database integrity. Each non-incremental lock argument (those without + or -) first releases all names owned by this process, and then gets ownership of the name specified. Incremental and decremental lock arguments get (+) or release (-) ownership of the specified names without releasing any other names. A name incrementally locked multiple times must be decrementally locked an equal number of times to release it. A lock of a list of names enclosed by parentheses will not succeed until all names listed are simultaneously available. A nonincremental lock of a list of names will not release the names owned by the process until it can simultaneously get ownership of all the names in its list. Timed lock sets $test to whether it got ownership of the name in the time requested; network latency and other extraneous delays are not counted in the timeout period. For arguments without a timeout, lock waits indefinitely until the name is released by whatever process owns it. Improperly coded, this can result in a deadly embrace, in which two processes stop execution at lock commands because each owns names for which the other is waiting.'},
      {commandFullName:'MERGE', commandSyntax: 'MERGE:Postconditional Variable=Variable', commandDescription: 'Copies the value and all array descendants from one variable to another variable. If either variable is an array descendant of the other, it causes error m19.'},      
      {commandFullName:'NEW', commandSyntax: 'NEW:Postconditional Argument', commandDescription: 'Saves and temporarily removes locals and their array descendants, and restores them when this block of code ends. Argumentless new saves and temporarily removes all locals and their array descendants, and restores them when this block of code ends.  Only unsubscripted local variables or the intrinsic special variables $estack and $etrap may be used in the argument of the new command. An exclusive new, a new argument consisting of a list of names within parentheses, saves and temporarily removes all locals, except those listed and their descendants.'},      
      {commandFullName:'OPEN', commandSyntax: 'OPEN:Postconditional Device:Parameters', commandDescription: 'Gets ownership of an i/o device, selects the list of available mnemonic spaces for that device, and sets the current mnemonic space to the first in the list selected. Open can also use device parameters to manipulate the device as it is acquired. Trying to open a device with a mnemonic space it doesn’t support causes error m35; trying to open it with incompatible mnemonic spaces causes error m36. Timed open sets $test to whether it got ownership in the specified time.'},
      {commandFullName:'QUIT', commandSyntax: 'QUIT:Postconditional Expression', commandDescription: 'Ends the current process level and returns a value; doing so when an argument is not expected causes error m16. Argumentless quit ends the current process level without returning a value, but if one is expected it causes error m17. Quit can also be used to end a for loop on the same line.'},
      {commandFullName:'READ', commandSyntax: 'READ:Postconditional Argument', commandDescription: 'Gets input from the current i/o device and puts the response in the specified variables. Any text and format control characters in the argument of the read command are output on the current device. Timed read sets $test to whether read got a response in the specified time.  When the argument contains an asterisk preceding a variable name, a code representing a single character is obtained. When the argument contains a variable followed by a "#" and a numeric expression, this expression specifies the maximum number of characters to accept. A number less than zero causes error m18.'},
      {commandFullName:'SET', commandSyntax: 'SET:Postconditional Destination=Expression', commandDescription: 'Puts values into variables. When the set destination is a list of destinations within parentheses, each destination is given the value following the assignment symbol. The $extract and $piece destinations change the specified part of their first arguments. Trying to set $x or $y to a negative or non-integer value causes error m43.'},
      {commandFullName:'TCOMMIT', commandSyntax: 'TCOMMIT:Postconditional', commandDescription: 'Commits and ends the current transaction: makes its global changes visible. A tcommit when there is no current transaction causes error m44.'},
      {commandFullName:'TRESTART', commandSyntax: 'TRESTART:Postconditional', commandDescription: 'Rolls back the current transaction (see trollback), optionally restores some or all of the symbol table (as dictated by the tstart command, see below), and starts the current transaction again. Attempting to restart a non-restartable transaction rolls back the transaction, ends it, and causes error m27. A trestart when there is no current transaction causes error m44.'},
      {commandFullName:'TROLLBACK', commandSyntax: 'TROLLBACK:Postconditional', commandDescription: 'Rolls back a transaction; that is, undoes its global changes and releases any locks acquired within the transaction. A trollback when there is no current transaction causes error m44.'},
      {commandFullName:'TSTART', commandSyntax: 'TSTART:Postconditional Variables:Parameters', commandDescription: 'Starts a restartable transaction. Argumentless tstart starts a nonrestartable transaction. When variables are specified, they are restored to their previous values if the transaction is restarted.'},
      {commandFullName:'USE', commandSyntax: 'USE:Postconditional Device:Parameters:MnemSpace', commandDescription: 'Picks the current device from the list of i/o devices owned by the current process, and the device’s mnemonic space from the list currently available for that device. Use can also use device parameters to manipulate the current device as it is selected.'},
      {commandFullName:'VIEW', commandSyntax: 'VIEW:Postconditional Argument', commandDescription: 'Returns or changes implementation-dependent information.'},
      {commandFullName:'WRITE', commandSyntax: 'WRITE:Postconditional Argument', commandDescription: 'Formats and outputs values to the current i/o device. When an argument includes an asterisk followed by an integer value, one character whose code (not necessarily ascii) is the number represented by the integer is sent to the current device; the effect this code has on the device is implementation-specific.'},
      {commandFullName:'XECUTE', commandSyntax: 'XECUTE:Postconditional Expression:Postcondition', commandDescription: 'Interprets and executes a value as mumps text. Xecute provides a means of interpreting a data value created during program execution as if it were mumps code. Each argument of the xecute command is interpreted as if it were the text part of a line of mumps code (without label, line start indicator, or line level indicator).'}
]
//Listing of full name of all MUMPS Commands.
//'READ', 'SET', 'TCOMMIT', 'TRESTART', 'TROLLBACK', 'TSTART', 'USE', 'VIEW', 'WRITE', 'XECUTE'];
//Listing of full name of intrinsic functions, with the exception of $Z.  Will be handled otherwise.
var arrayIntrinsicFunctions = ['$ASCII', '$CHAR', '$DATA', '$EXTRACT', '$FIND', '$FNUMBER', '$GET', '$JUSTIFY', '$LENGTH', '$NAME', '$ORDER', '$PIECE', '$QLENGTH', '$QSUBSCRIPT', '$QUERY', '$RANDOM', '$REVERSE', '$SELECT', '$STACK', '$TEXT', '$TRANSLATE', '$VIEW'];

  for (var i in inputJSON.mCode) {
    for (var ii in inputJSON.mCode[i].commands) {
      for (iii=0;iii<arrayCommands.length;iii++) {
        if ((arrayCommands[iii].commandFullName.substring(0,inputJSON.mCode[i].commands[ii].command.length) === inputJSON.mCode[i].commands[ii].command) && arrayCommands[iii].commandFullName.substring(0,inputJSON.mCode[i].commands[ii].command.length).length > 0) {
          //Handler for HALT/HANG Issue.
          if (inputJSON.mCode[i].commands[ii].command.substring(0,1) === "H" && inputJSON.mCode[i].commands[ii].parameterString.length > 0) {
            inputJSON.mCode[i].commands[ii]["commandFullName"] = arrayCommands[7].commandFullName;
            inputJSON.mCode[i].commands[ii]["commandSyntax"] = arrayCommands[7].commandSyntax;
            inputJSON.mCode[i].commands[ii]["commandDescription"] = arrayCommands[7].commandDescription;
          //Otherwise, normal return.
          } else {
            inputJSON.mCode[i].commands[ii]["commandFullName"] = arrayCommands[iii].commandFullName;
            inputJSON.mCode[i].commands[ii]["commandSyntax"] = arrayCommands[iii].commandSyntax;
            inputJSON.mCode[i].commands[ii]["commandDescription"] = arrayCommands[iii].commandDescription;
          }
        }
      }
    }
  }
return inputJSON;
}

//Contingent on functionFullName being set.
function applyFnSET(inputJSON) {

var argArray = [];

  for (var i in inputJSON.mCode) {
    for (var ii in inputJSON.mCode[i].commands) {
      if (inputJSON.mCode[i].commands[ii].functionFullName === "SET") {
        //First, divide by non-string commas.
        var prePARAM = 0;
        for(posPARAM=0;posPARAM <= inputJSON.mCode[i].commands[ii].parameterString.length;posPARAM++) {
          if (inputJSON.mCode[i].commands[ii].parameterString[posPARAM] === ",") {
            if ((inputJSON.mCode[i].commands[ii].parameterString.substring(0,posPARAM).split("\"").length % 2 !== 0) && (inputJSON.mCode[i].commands[ii].parameterString.substring(posPARAM).split("\"").length % 2 !== 0)) {    
              if (inputJSON.mCode[i].commands[ii].parameterString.substring(prePARAM,posPARAM).length > 0) {argArray.push(inputJSON.mCode[i].commands[ii].parameterString.substring(prePARAM,posPARAM))};
            prePARAM = posPARAM + 1;
            }
          } else if (posPARAM === inputJSON.mCode[i].commands[ii].parameterString.length) {
            if (inputJSON.mCode[i].commands[ii].parameterString.substring(prePARAM,posPARAM).length > 0) {argArray.push(inputJSON.mCode[i].commands[ii].parameterString.substring(prePARAM,posPARAM))};
            prePARAM = 0;
          }
        }
       if (argArray.length > 0) {
        var argParams = [];
        var argJSON = {}
          for (paramArray =0; paramArray<argArray.length; paramArray++) {
            argJSON = {
              "parameterNumber": paramArray,
              "parameter": argArray[paramArray]
            }
            argParams.push(argJSON);
          }
          inputJSON.mCode[i].commands[ii].parameters = argParams;
            
          //console.log(inputJSON.mCode[i].commands[ii].parameterArray);
          argArray = [];
        }
      }
    }
  }
return inputJSON;
}