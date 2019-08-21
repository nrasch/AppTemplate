@extends('layouts.app')

@section('content')
<div class="container">

    <div class="row">
        <div class="col-md-12">

            <!-- React User manager  -->
            <div class="mt-5" id="users" />
            <!-- END React User manager  -->

        </div>
    </div>

</div>
@endsection

@section('js_after')
  <script type="text/javascript">
    $(document).ready(function() {
        //
    } );
  </script>
@endsection
