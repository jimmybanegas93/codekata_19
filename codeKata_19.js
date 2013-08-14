var fs = require('fs');

var words = fs.readFileSync("/usr/share/dict/words")
              .toString()
              .toLowerCase()
              .split("\n");

var countDifferences = function(word1, word2) {
    var count = 0;
    for (var i = 0; i < word1.length; i++) {
        if (word1[i] !== word2[i]) count++;
    }
    return count;
}

var memo = []

var search = function(start, end, predecessors) {
    predecessors = predecessors.concat(start);
    memo = memo.concat(start);
    if (start === end) return predecessors;
    var wordlist = words.filter(function(word) {
        return word.length === start.length
               && countDifferences(start, word) === 1
               && predecessors.indexOf(word) === -1
               && memo.indexOf(word) === -1;
    }).filter(function(word, idx, list) {
        return list.indexOf(word) === idx;
    }).sort(function(word1, word2) {
        return countDifferences(word1, end) - countDifferences(word2, end);
    })
    for (var i = 0; i < wordlist.length; i++) {
        var x = search(wordlist[0], end, predecessors);
        if (x) return x;
    }
}

console.log(search("ruby", "code", []));
