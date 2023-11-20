// const BACKEND_URL = 'http://127.0.0.1:5000'; // NOTE: JUST FOR LOCAL TESTING
const BACKEND_URL = 'https://promptly-399210.nw.r.appspot.com/';
const GET_BEST_PROMPTS_ENDPOINT = '/api/getBestPrompts';
const POST_PROMPT_FEEDBACK_ENDPOINT = '/api/postPromptFeedback';
console.log("running Promptly :)");

function promptCardCSS(promptCard) {
    promptCard.style.display = 'flex';
    promptCard.style.flexDirection = 'column';
    promptCard.style.marginTop = '10px';
    promptCard.style.padding = '10px';
    promptCard.style.border = '1px solid white';
    promptCard.style.borderRadius = '5px';
    promptCard.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    promptCard.style.color = 'white';
    promptCard.style.fontFamily = 'Arial, Helvetica, sans-serif';
}
function formatPromptCardText(item) {
    item.style.margin = '0';
    item.style.padding = '0';
    item.style.fontSize = '0.8em';
    item.style.fontWeight = 'bold';
    item.style.textAlign = 'center';
    item.style.justifyContent = 'center';
    item.style.display = 'flex';
}

function createPromptCard(result) {
    const prompt = result;
    // truncate rating to 2 decimal places
    // const rating = Math.round(result.rating * 100) / 100;
    const rating = 4.5;
    const popularity = 10;
    console.log(prompt, rating, popularity);
    // make promptCard a button
    const promptCard = document.createElement('button');
    // add an event listener to the button
    promptCard.addEventListener('click', function() {
        // set the text of the textarea to the prompt
        promptTextarea.value = prompt;
    });
    promptCardCSS(promptCard);

    const popularityText = document.createElement('p');
    popularityText.innerHTML = "Popularity: " + popularity;
    formatPromptCardText(popularityText);
    promptCard.appendChild(popularityText)

    // create the rating text
    const ratingText = document.createElement('p');
    ratingText.innerHTML = "Rating: " + rating;
    formatPromptCardText(ratingText);
    promptCard.appendChild(ratingText)

    // create the prompt text
    const promptText = document.createElement('p');
    promptText.innerHTML = prompt;
    formatPromptCardText(promptText);
    promptCard.appendChild(promptText);

    return promptCard;
}

////////////////////////
// MAIN BODY
////////////////////////

// div storing all promptly content, overlayed on the browser page
const promptly_overlay = document.createElement('div');
setInitialCSS();
document.body.appendChild(promptly_overlay);

const promptly_heading = document.createElement('Promptly');
promptly_heading.innerHTML = 'Promptly';
setPromptlyHeadingCSS();
promptly_overlay.appendChild(promptly_heading);


// read the content of the div as the user types into the textarea
const promptTextarea = document.getElementById("prompt-textarea")
let previousTime = Date.now();
promptTextarea.addEventListener('input', function(event) {

    // only console log the text after each space or new word is typed
    const terminationCharacters = [' ', '.', '?', '!']
    // store previous value of textarea to ensure we do not console log the same text twice
    if (terminationCharacters.includes(promptTextarea.value.slice(-1)) && promptTextarea.value.length > 1) {
        // only console log once every 2.5 seconds
        console.log(Date.now() - previousTime, "ms between attempted fetches");
        if (Date.now() - previousTime > 2500) {
            previousTime = Date.now();
            console.log(promptTextarea.value);

            const endpoint = BACKEND_URL + GET_BEST_PROMPTS_ENDPOINT;
            fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prompt: promptTextarea.value,
                    age_range: '20-30',
                    location: 'London'
                })
            }).then(response => response.json())
            .then(results => {
                console.log(results);
                // clear the overlay
                promptly_overlay.innerHTML = '';
                // add the heading back
                promptly_overlay.appendChild(promptly_heading);

                results.forEach(result => {
                    const promptCard = createPromptCard(result);
                    promptly_overlay.appendChild(promptCard);
                })
            })
        }
    };
});

promptTextarea.addEventListener('keydown', function(event) {
    // if the user presses enter, submit the prompt
    if (event.key === "Enter") {
        console.log('enter pressed');
        createFeedbackForm();
    }
});

////////////////////////
// FEEDBACK SECTION
////////////////////////

function createFeedbackForm(){
    // write the promptTextarea.value to local storage
    localStorage.setItem('prompt', promptTextarea.value);
    // clear the overlay
    promptly_overlay.innerHTML = '';
    // add the heading back
    promptly_overlay.appendChild(promptly_heading);
    // change prompt_overlay to form
    promptly_overlay.appendChild(sharePromptFeedbackForm);
}
const submitPromptButton = document.querySelector("[data-testid='send-button']");
// make it so that anu click on the screen will clear the overlay
// submitPromptButton.addEventListener('click', function() {
submitPromptButton.addEventListener('click', function() {
   console.log('submit button clicked');
   createFeedbackForm();
});

// setup form to share feedback on the prompt response to the backend
const sharePromptFeedbackForm = document.createElement('form');
setSharePromptFeedbackFormCSS();


// add a section to submit written feedback
const feedbackSection = document.createElement('div');
feedbackSection.style.display = 'flex';
feedbackSection.style.flexDirection = 'column';
feedbackSection.style.marginBottom = '5px';
sharePromptFeedbackForm.appendChild(feedbackSection);

// add a label to the written feedback section
const scoreFeedbackLabel = document.createElement('label');
scoreFeedbackLabel.innerHTML = 'How happy are you with the response?';
scoreFeedbackLabel.style.fontSize = '0.8em';
scoreFeedbackLabel.style.fontWeight = 'bold';
scoreFeedbackLabel.style.marginBottom = '5px';
feedbackSection.appendChild(scoreFeedbackLabel);

const scoreFeedbackRating = document.createElement('div');
scoreFeedbackRating.style.alignItems = 'center';
const oneStar = document.createElement('span');
const twoStar = document.createElement('span');
const threeStar = document.createElement('span');
const fourStar = document.createElement('span');
const fiveStar = document.createElement('span');
oneStar.dataset.rating = 1;
twoStar.dataset.rating = 2;
threeStar.dataset.rating = 3;
fourStar.dataset.rating = 4;
fiveStar.dataset.rating = 5;

const stars = [oneStar, twoStar, threeStar, fourStar, fiveStar];
let currentRating = 0;
stars.forEach(star => {
    star.style.fontSize = '1.75em';
    star.style.margin = '0 3% 0 0';
    star.innerHTML = '\u2606';
    star.style.cursor = 'pointer';
    star.addEventListener('click', function() {
        // change the innerHTML of the star to be a filled star
        star.innerHTML = '\u2605';
        // change the innerHTML of all stars with a lower rating to be a filled star
        currentRating = star.dataset.rating;
        console.log(currentRating)
        for (let i = 0; i < currentRating - 1; i++) {
            stars[i].innerHTML = '\u2605';
        }
        // change the innerHTML of all stars with a higher rating to be an unfilled star
        for (let i = currentRating; i < 5; i++) {
            stars[i].innerHTML = '\u2606';
        }
    });
    scoreFeedbackRating.appendChild(star);
});
feedbackSection.appendChild(scoreFeedbackRating);

// add a label for written feedback
const writtenFeedbackLabel = document.createElement('label');
writtenFeedbackLabel.innerHTML = 'Any written feedback?';
writtenFeedbackLabel.style.fontSize = '0.8em';
writtenFeedbackLabel.style.fontWeight = 'bold';
writtenFeedbackLabel.style.marginBottom = '5px';
feedbackSection.appendChild(writtenFeedbackLabel);

// add a textarea for written feedback
const writtenFeedbackTextarea = document.createElement('textarea');
writtenFeedbackTextareaCSS();
writtenFeedbackTextarea.placeholder = 'Optional but super helpful!';
feedbackSection.appendChild(writtenFeedbackTextarea);

// add a submit button
const submitFeedbackButton = document.createElement('p');
submitFeedbackButtonCSS();
feedbackSection.appendChild(submitFeedbackButton);

// add an event listener to the submit button
submitFeedbackButton.addEventListener('click', function() {
    console.log("submit feedback button clicked");
    // get the prompt from local storage
    const prompt = localStorage.getItem('prompt');
    // get the score feedback
    const promptRating = currentRating;
    // get the written feedback
    const writtenFeedback = writtenFeedbackTextarea.value;
    console.log("Submitting: ", prompt, promptRating, writtenFeedback);
    // send the feedback to the backend
    const endpoint = BACKEND_URL + POST_PROMPT_FEEDBACK_ENDPOINT;
    fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            prompt: prompt,
            promptRating: promptRating,
            writtenFeedback: writtenFeedback,
        })
    }).then(response => response.json()).then(() => {
            promptly_overlay.innerHTML = '';
            promptly_overlay.appendChild(promptly_heading);}
    )

});
