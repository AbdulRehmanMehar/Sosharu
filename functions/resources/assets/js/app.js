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
        let errors = data.responseJSON.errors;
        console.log(errors);
        $(errors).each((i,{param, msg}) => {
          // Removing Old Messages
          $(e.target).children('input').removeClass('is-invalid');
          $(e.target).children('small.invalid-feedback').html('');
          // Setting New Messages
          $(`[name=${param}]`).addClass('is-invalid');
          $(`[name=${param}]`).next().html(msg);

          // Check for universal errors
          if(param == "error"){
            let error = $(`<div class="alert alert-danger" role="alert"><b>${msg}</b></div>`);
            $(".alert-saved").append(error);
            setTimeout(function () {
              $(error).remove();
            }, 2000);
          }
        });
      }
    });
  });

});