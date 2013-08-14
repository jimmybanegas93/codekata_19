var fs = require('fs');

// Read the words file, convert to a string, convert to lower case and split on
// newline characters to create an array of all words.
var words = fs.readFileSync("words")
              .toString()
              .toLowerCase()
              .split("\n");

// Counts the number of letters differing between word1 and word2
var countDifferences = function(word1, word2) {
    var count = 0;
    for (var i = 0; i < word1.length; i++) {
        if (word1[i] !== word2[i]) count++;
    }
    return count;
}

// Memo holds all the words we've seen before so we don't visit them again.
// This isn't really necessary but drastically reduces the search space, so
// it's a nice optimisation.
var memo = []

var _search = function(start, end, predecessors) {
    // Add the current word to the chain.
    predecessors = predecessors.concat(start);
    // Add the current word to the memo.
    memo = memo.concat(start);
    // If start and end are the same words, predecessors now holds a chain
    // linking the start word to the end word. RESULT!
    if (start === end) return predecessors;
    var wordlist = words.filter(function(word) {
        // Filters the list of words to contain only those words that are the
        // same length as our target word, and differ by only one letter from
        // our current word, and are not in the chain already (to prevent
        // loops) and are not in the memo already (to prevent duplication of
        // searches).
        return word.length === end.length
               && countDifferences(start, word) === 1
               && predecessors.indexOf(word) === -1
               && memo.indexOf(word) === -1;
    }).filter(function(word, idx, list) {
        // Little trick to remove all duplicates from the list resulting from
        // the previous filter. It's faster to do it here since this list is
        // MUCH smaller than the original word list.
        return list.indexOf(word) === idx;
    }).sort(function(word1, word2) {
        // Sorts the resulting list so that words with the least differences
        // from the end word come first. If we're building a chain from "cat"
        // to "dog", three possible steps from "cat" are:
        //              cot
        //              cap
        //              eat
        // cap and eat still have 3 different letters to dog, but cot only has
        // 2 different letters to dog. This is a nice heuristic indicator that
        // the chain from cot to dog will be shorter than the chain from cap
        // to dog, since it will take at least 3 more applications to get there
        // from cap and only 2 from cot.
        //
        // This essentially performs the heuristic weighting step of a standard
        // A* search.
        return countDifferences(word1, end) - countDifferences(word2, end);
    })
    for (var i = 0; i < wordlist.length; i++) {
        // Recursively call search on each candidate word. If the value returned
        // is not undefined, a chain exists, so we can stop. Shortest chains
        // should always be found first, but it might be worth a refactor
        // to make this find all possible chains and then return the shortest
        // one. (exercise left to the reader!)
        var x = search(wordlist[i], end, predecessors);
        if (x) return x;
    }
}

var search = function(start, end) {
    return _search(start, end, [])
}

console.time("x");
console.log(search("cat", "dog"));
console.timeEnd("x");
