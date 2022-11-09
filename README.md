API description

GET/voter-information
INPUT: address of voter
OUTPUT: 
voter weight: 0 or 1
voter votes: false or true

POST/give-right-to-vote
INPUT: address of voter
OUTPUT: receipt

POST/cast-vote
INPUT:
{"id1": "2", "id2": "0","id3": "4","id4": "6","id5": "9"}
where id1, id2, ... - numbers of proposals (candidates)
OUTPUT: receipt

GET/winner-list-score
INPUT: nothing
OUTPUT: list of 3 top winners with number of proposal and score.

ABI: /src/assets/Ballot.json
