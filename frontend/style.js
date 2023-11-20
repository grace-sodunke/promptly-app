// set up a function to set initial css of the overlay
function setInitialCSS() {
    promptly_overlay.style.position = 'fixed';
    // size and location of the overlay
    promptly_overlay.style.top = '10%';
    promptly_overlay.style.right = '0';
    promptly_overlay.style.width = '20%';
    // make height dependent on the number of prompts
    promptly_overlay.style.height = 'auto';
    promptly_overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    // rounded corners
    promptly_overlay.style.borderTopLeftRadius = '10px';
    promptly_overlay.style.borderBottomLeftRadius = '10px';
    // padding
    promptly_overlay.style.padding = '10px';
    promptly_overlay.style.color = 'white';
    console.log("imported style.js")
}

function setPromptlyHeadingCSS() {
    promptly_heading.style.fontSize = '1.3em';
    promptly_heading.style.fontFamily = 'Arial, Helvetica, sans-serif';
    promptly_heading.style.fontWeight = 'bold';
    promptly_heading.style.margin = '0';
    promptly_heading.style.padding = '0';
    // center the text
    promptly_heading.style.textAlign = 'center';
    promptly_heading.style.justifyContent = 'center';
    promptly_heading.style.display = 'flex';
}

function setSharePromptFeedbackFormCSS() {
    sharePromptFeedbackForm.style.display = 'flex';
    sharePromptFeedbackForm.style.flexDirection = 'column';
    sharePromptFeedbackForm.style.marginTop = '10px';
    sharePromptFeedbackForm.style.padding = '10px';
    sharePromptFeedbackForm.style.border = '1px solid white';
    sharePromptFeedbackForm.style.borderRadius = '5px';
    sharePromptFeedbackForm.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    sharePromptFeedbackForm.style.color = 'white';
    sharePromptFeedbackForm.style.fontFamily = 'Arial, Helvetica, sans-serif';
}

function writtenFeedbackTextareaCSS(){
    writtenFeedbackTextarea.style.height = '6%';
    writtenFeedbackTextarea.style.resize = 'none';
    writtenFeedbackTextarea.style.border = '1px solid white';
    writtenFeedbackTextarea.style.borderRadius = '5px';
    writtenFeedbackTextarea.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    writtenFeedbackTextarea.style.color = 'white';
    writtenFeedbackTextarea.style.fontFamily = 'Arial, Helvetica, sans-serif';
}

function submitFeedbackButtonCSS(){
    submitFeedbackButton.innerHTML = 'Submit';
    submitFeedbackButton.style.marginTop = '10px';
    submitFeedbackButton.style.padding = '10px';
    submitFeedbackButton.style.border = '1px solid white';
    submitFeedbackButton.style.borderRadius = '5px';
    submitFeedbackButton.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    submitFeedbackButton.style.color = 'white';
    submitFeedbackButton.style.fontFamily = 'Arial, Helvetica, sans-serif';
    submitFeedbackButton.style.cursor = 'pointer';
}