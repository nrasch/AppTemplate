@extends('layouts.app')

@section('content')
    <!-- React User manager  -->
    <div class="container-fluid">
        <div class="mt-5" id="users" />
    </div>
@endsection

@section('js_after')
  <script type="text/javascript">
    $(document).ready(function() {
        //
    } );
  </script>
@endsection
