eMcellent

A most excellent tool for making M/MUMPS more readable.

This project is licensed under the Apache 2.0 license.

eMcellent is a tool designed to make M/MUMPS code more easily readable and interpretable.  It does so through taking an input block of M/MUMPS code, typically a routine, tokenizing it into its component parts, and presenting them as JSON.  This JSON block is then passed through a series of sub-routines which append contextual information onto the JSON block.  Once processing is completed, it is passed to client(s) for presentation.

This project is written in node.js, and uses: 
JQuery, Express, Jade, Twitter Bootstrap, Prettify.js, and MongoDB.

For a demo, visit:  http://emcellent.aws.af.cm/

This site is deployed using appfog, which makes posting to the cloud as simple as running "af update emcellent."
