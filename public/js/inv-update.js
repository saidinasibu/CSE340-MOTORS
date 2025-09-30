function enableButtonOnFormChange(formId) {
  const form = document.querySelector(formId);
  if (form) {
      form.addEventListener("change", function () {
          const updateBtn = form.querySelector("button");
          if (updateBtn) {
              updateBtn.removeAttribute("disabled");
          }
      });
  }
}

enableButtonOnFormChange("#updateForm");
enableButtonOnFormChange("#updateAccountForm");
enableButtonOnFormChange("#updateAccountForm2");