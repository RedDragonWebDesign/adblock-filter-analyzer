// unit test suite = Jest

class AdBlockValidator {
	$inputString;
	$stack;
	/** A list of punctuation that needs to be encountered to close the current item. If this syntax is not encountered before the end of the file, then the syntax is invalid. */
	$closingStack;
	$valid;
	$outputString;
}

class Syntax {
	$syntax;
	$explanation;
}