<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <!-- CSRF Token -->
  <meta name="csrf-token" content="{{ csrf_token() }}">

  <title>{{ config('app.name', 'Laravel') }}</title>

  <!-- Fonts -->
  <link rel="dns-prefetch" href="//fonts.gstatic.com">
  <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet">

  <!-- Styles -->
  @yield('css_before')
  <link href="{{ asset('css/app.css') }}" rel="stylesheet">
  @yield('css_after')

  <!-- Scripts -->
  <script>window.Laravel = {!! json_encode(['csrfToken' => csrf_token(),]) !!};</script>

</head>
<body>
  <div id="app">

    <div class="d-flex" id="wrapper">

      <!-- Sidebar -->
      @include('components.left_nav')
      <!-- END Sidebar -->

      <!-- Page Content -->
      <div id="page-content-wrapper">

        <!-- Top Nav -->
        @include('components.top_nav')
        <!-- END Top Nav -->

        <div class="container-fluid">
          <main class="mt-4">

            @yield('content')

            <!-- React example binding  -->
            <div class="mt-5" id="example" />
            <!-- END React example binding  -->

          </main>
        </div>
        <!-- END <div class="container-fluid"> -->

      </div>
      <!-- /#page-content-wrapper -->

    </div>
    <!-- /#wrapper -->

  </div>
  <!-- END <div id="app"> -->

  <!-- Scripts -->
  <!-- Move this here and remove 'defered', or you'll have a jQuery not defined error!
  See https://stackoverflow.com/questions/51595843/laravel-5-webpack-jquery-is-not-defined -->
  <script src="{{ mix('js/app.js') }}"></script>

  <script type="text/javascript">
    $("#menu-toggle").click(function(e) {
      e.preventDefault();
      $("#wrapper").toggleClass("toggled");
    });
  </script>

  @yield('js_after')

</body>
</html>
