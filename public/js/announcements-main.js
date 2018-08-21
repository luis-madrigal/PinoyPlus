$(document).ready(function() {
  $(".anment-description").click(function() {
    window.location.href = "/threads";
  });

  $(".alert-autocloseable-success").hide();

  $("#autoclosable-btn-success").click(function() {
    $("#autoclosable-btn-success").prop("disabled", true);
    $(".alert-autocloseable-success").show();

    $(".alert-autocloseable-success")
      .delay(3000)
      .fadeOut("slow", function() {
        // Animation complete.
        $("#autoclosable-btn-success").prop("disabled", false);
      });
  });

  $(document).on("click", ".close", function() {
    $(this)
      .parent()
      .hide();
  });
});
