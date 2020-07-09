# adblock-filter-analyzer
JavaScript library that analyzes AdBlock Filter Syntax. Colorizes and explains the syntax. Good for learning.

Live version located at https://www.reddragonwebdesign.com/projects/AdBlock%20Filter%20Analyzer/

I made this because I was teaching myself AdBlock filter language, and I had trouble finding a tool that diced the filters into their basic parts and explained what they were.

## Features

- Mainly a code coloring and learning tool. But does some validation too.
- Handles very large files (30,000 lines will take a couple of seconds, but will parse)
- Gives an error count and detailed error report
- Colors 17 different kinds of syntax
- Checks for some common errors
- Validates RegEx
- Checks options and uboScriptlets against a list of valid functions, marks as error if not found.
- Colors and error checks as you type

## Tests

This project is a perfect fit for Test Driven Development.

I've written a list of tests that should always pass, and a list of tests that should always fail. I frequently plug these test lists into my filter, look for errors, and improve the code.

I've got plenty of "should always pass" lists from the AdBlock filter lists floating around out there. But I am very interested in "should always fail" tests. Feel free to create issues or pull requests and submit additional fail tests.