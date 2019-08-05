@extends('layouts.auth')

@section('content')
<!-- Page Content -->
<div class="bg-image"
<div class="hero-static bg-white-95">
  <div class="content">
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6 col-xl-4">
        <!-- Sign In Block -->
        <div class="block block-themed block-fx-shadow mb-0">
          <div class="block-content">
            <div class="p-sm-3 px-lg-4 py-lg-5">
              <h1 class="mb-2">Application Template</h1>
              <p>Welcome, please login.</p>

              <!-- Sign In Form -->
              <form action="{{ route('login') }}" method="POST">

                @csrf

                <div class="py-3">
                  <div class="form-group">
                    <input type="text" class="form-control form-control-alt form-control-lg {{ $errors->has('email') ? ' is-invalid' : '' }}"
                    id="email" name="email" placeholder="E-mail Address" value="{{ old('email') }}" autofocus>

                    @if ($errors->has('email'))
                    <span class="text-danger" role="alert">
                      <strong>{{ $errors->first('email') }}</strong>
                    </span>
                    @endif
                  </div>

                  <div class="form-group">
                    <input type="password" class="form-control form-control-alt form-control-lg  {{ $errors->has('password') ? ' is-invalid' : '' }}"
                    id="password" name="password" placeholder="Password">

                    @if ($errors->has('password'))
                    <span class="text-danger" role="alert">
                      <strong>{{ $errors->first('password') }}</strong>
                    </span>
                    @endif
                  </div>

                </div>
                <div class="form-group row">
                  <div class="col-md-6 col-xl-5">
                    <button type="submit" class="btn btn-block btn-primary">
                      <i class="fa fa-fw fa-sign-in-alt mr-1"></i> Sign In
                    </button>
                  </div>
                </div>
              </form>
              <!-- END Sign In Form -->
            </div>
          </div>
        </div>
        <!-- END Sign In Block -->
      </div>
    </div>
  </div>
</div>
</div>
<!-- END Page Content -->
@endsection
