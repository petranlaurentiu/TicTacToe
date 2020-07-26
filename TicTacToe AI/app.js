// The win conditions are represented by an array containing eight arrays, 
//one for each possible three square winning combination.
var winConditions = [ [0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6] ];
var squareCount = 9;
var squares = document.getElementsByClassName("square");
var difficulty = "beginner";
var gameOver = false;

var setMessageBox = function( caption )
{
	var messageBox = document.getElementById( "messageBox" );
    messageBox.innerHTML = caption;
};

var findClaimedSquares = function( marker )
{
	var claimedSquares = [];
	var value;

	for( var id = 0; id < squareCount; id++ )
	{
		value = document.getElementById( id ).innerHTML;
		if( value === marker )
		{
			claimedSquares.push(id);
		}
	}

	return claimedSquares;
}

var resetGame = function()
{
	gameOver = false;
	setMessageBox( "Pick a square!" );

	for( var id = 0; id < squareCount; id++ )
	{
		var square = document.getElementById( id );
		square.innerHTML = "";
		square.style.backgroundColor = "rgb(102, 178, 255)";
	}
}

var checkForWinCondition = function( marker )
{
	var claimedSquares = findClaimedSquares( marker );

	var win = false;
	for( var i = 0; i < winConditions.length; i++ )
	{
		win = winConditions[i].every( element => claimedSquares.indexOf( element ) > -1 );
		if( win )
		{
			win = winConditions[i];
			break;
		}
	}
	return win;
};

var secureWin = function()
{
	return makeMove( "O" );
}

var preventDefeat = function()
{
	return makeMove( "X" );
}

var makeMove = function( marker )
{
	var moveMade = false;
	for( var i = 0; i < winConditions.length; i++ )
	{
		var count = 0;
		for( var j = 0; j < winConditions[i].length; j++ )
		{
			if(  marker === document.getElementById( winConditions[i][j] ).innerHTML )
			{
				count++;
			}
		}

		if( count == 2 )
		{
			for( j = 0; j < winConditions[i].length; j++ )
			{
				var square = document.getElementById( winConditions[i][j] )
				if( squareIsOpen( square ) )
				{
					square.innerHTML = "O";
					moveMade = true;
					break;
				}
			}
		}

		if( moveMade )
		{
			break;
		}
	}
	return moveMade;
}

var opponentMove = function()
{
	if( difficulty === "beginner" )
	{
		makeMoveAtFirstAvailableSquare();
	}
	else
	{
		var moveMade = secureWin()
		if( !moveMade )
		{
			moveMade = preventDefeat();
			if( !moveMade )
			{
				var center = document.getElementById( 4 );
				if( squareIsOpen( center  ) )
				{
					center.innerHTML = "O";
				}
				else
				{
					makeMoveAtFirstAvailableSquare();
				}
			}
		}
	}
}

var makeMoveAtFirstAvailableSquare = function()
{
	for( var id = 0; id < squareCount; id++ )
	{
		square = document.getElementById( id );
		if( squareIsOpen( square ) )
		{
			square.innerHTML = "O";
			break;
		}
	}
}

var squareIsOpen = function( square )
{
	return ( square.innerHTML !== "X" && square.innerHTML !== "O" );
}

var highlightWinningSquares = function( winningSquares, color )
{
	for( var i = 0; i < winningSquares.length; i++ )
	{
		document.getElementById( winningSquares[i] ).style.backgroundColor = color;
	}
}

var checkForDraw = function()
{
	var draw = true;
	for( var id = 0; id < squareCount; id++ )
	{
		if( squareIsOpen( document.getElementById( id ) ) )
		{
			draw = false;
			break;
		}
	}
	return draw;
}

var chooseSquare = function() 
{
	//The first thing we do is set the difficulty variable to whatever was chosen in the drop down list. 
	//This is important because our artificial intelligence looks at this variable to determine what move to make
    difficulty = document.getElementById("difficulty").value;
    // Check if the game is over. If it is not then we can proceed. Otherwise, there is no need to continue
	if( !gameOver )
	{
        //We set the message displayed to the player to the default, “Pick a square!” message. We do this by calling the setMessageBox function. 
        //Then we set variables for the id and the HTML of the square that was selected by the player.
		setMessageBox( "Pick a square!" );
	    var id = this.getAttribute("id");
        var square = document.getElementById( id );
        //We check if the square is open by calling squareIsOpen. If a marker has already been placed there then the player is trying to make an illegal move. 
        //In the corresponding else block, we notify him as such
	    if( squareIsOpen( square ) ) 
	    {
			square.innerHTML = "X"; //Since the square is open, we set the marker to “X”. Then we check to see if we won by calling checkForWinCondition. 
									//If we won we are returned an array containing the winning combination. If lost we are simply returned false
	    	var win = checkForWinCondition( "X" );
			if( !win ) //If the player didn’t win then we must continue so that his opponent can make a move. 
					   //If the player did win, then the corresponding else block will handle it by setting the game over variable to true, 
					   //turning the winning squares green by calling highlightWinningSquares, and setting the winning message.
	    	{
	    		opponentMove();//Now that the player’s move is finished we need to make a move for the computer. The function called opponentMove handles this
	    		var lost = checkForWinCondition( "O" );
				if( !lost)// If the computer did not win then we must continue so that we can check for a draw. If the computer did win, 
						  //then the corresponding else block will handle it by setting the game over variable to true, turning the winning squares red by calling highlightWinningSquares, and setting the losing message.
	    		{
					var draw = checkForDraw();//We check for a draw by calling the checkForDraw function. 
											  //If there are no win conditions met and there are no more available moves to be made then we must have reached a draw. 
                                              //If a draw has been reached then we set the game over variable to true and set the draw message.
	    			if( draw )
	    			{
	    				gameOver = true;
	    				setMessageBox( "It's a draw!" );
	    			}
	    		}
	    		else
	    		{
	    			gameOver = true;
	    			highlightWinningSquares( lost, "rgb(229, 55, 55)" );
	    			setMessageBox( "You lost!" );
	    		}
	    	}
	    	else
	    	{
	    		gameOver = true
	    		highlightWinningSquares( win, "rgb(42, 178, 72)" );
	    		setMessageBox( "You won!" );
	    	}

	    }
	    else
	    {
	    	setMessageBox( "That square is already taken!" );
	    }
	}
};


for (var i = 0; i < squares.length; i++) 
{
    squares[i].addEventListener('click', chooseSquare, false);
}


