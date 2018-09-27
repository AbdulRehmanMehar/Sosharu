$(document).ready(() => {

  // Submit Forms Silently.
  $('#silent-form').submit((e) => {
    e.preventDefault();
    $.ajax({
      type: $(e.target).attr('method'),
      url: $(e.target).attr('action'),
      data: $(e.target).serialize(),
      success: (data) => {
        console.log(data);
      },
      error: (data) => {
        console.log(data);
      }
    });
  });

});