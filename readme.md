eMcellent

A most excellent tool for making M/MUMPS more readable.

This project is licensed under the Apache 2.0 license.

eMcellent is a tool designed to make M/MUMPS code more easily readable and interpretable.  It does so through taking an input block of M/MUMPS code, typically a routine, tokenizing it into its component parts, and presenting them as JSON.  This JSON block is then passed through a series of sub-routines which append contextual information onto the JSON block.  Once processing is completed, it is passed to client(s) for presentation.

This project is written in node.js, using the Express framework and MongoDB.  The included client uses the Jade templating engine.