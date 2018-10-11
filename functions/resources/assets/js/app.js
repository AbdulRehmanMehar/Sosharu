$(document).ready(() => {

  // Submit Forms Silently.
  $('.silent-form').each((i, element) => {
    $(element).submit((e) => {
      e.preventDefault();

      $('input.is-invalid').each((e, input) => {
        $(input).removeClass('is-invalid');
      });
      
      $('span.is-invalid').each((e, span) => {
        $(span).html('');
      });

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
          $(errors).each((i, {
            param,
            msg
          }) => {
            // Setting New Messages
            $(`[name=${param}]`).addClass('is-invalid');
            $(`[name=${param}]`).next().html(msg);

            // Check for universal errors
            if (param == "error") {
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
});