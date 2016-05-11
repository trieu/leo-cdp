<section id="login" class="col-md-4 col-md-offset-4">
    <header>
        <h1>SUPER ADMIN ADSPLAY</h1>
    </header>

    <div class="clearfix"></div>

    <!-- Login -->
    <?php echo form_open('',array('class'=>'box tile animated active','id' =>'box-login'));?>
        <h2 class="m-t-0 m-b-15">Login</h2>
        <?php echo $this->session->flashdata('message');?>
        <?php echo form_error('identity');?>
        <input type="text" name="identity" value="" class="login-control m-b-10" placeholder="Username or Email Address">
        <?php echo form_error('password');?>
        <input type="password" name="password" value="" class="login-control" placeholder="Password">
        <div class="checkbox m-b-20">
            <label>
                <input type="checkbox" name="remember">
                Remember Me
            </label>
        </div>
        <?php echo form_submit('submit', 'Log in', 'class="btn btn-sm m-r-5"');?>

        <small>
            <a class="box-switcher" data-switch="box-register" href="">Don't have an Account?</a> or
            <a class="box-switcher" data-switch="box-reset" href="">Forgot Password?</a>
        </small>
    </form>
    <?php echo form_close();?>
    <!-- Register -->
    <form class="box animated tile" id="box-register">
        <h2 class="m-t-0 m-b-15">Register</h2>
        <input type="text" class="login-control m-b-10" placeholder="Full Name">
        <input type="text" class="login-control m-b-10" placeholder="Username">
        <input type="email" class="login-control m-b-10" placeholder="Email Address">
        <input type="password" class="login-control m-b-10" placeholder="Password">
        <input type="password" class="login-control m-b-20" placeholder="Confirm Password">

        <button class="btn btn-sm m-r-5">Register</button>

        <small><a class="box-switcher" data-switch="box-login" href="">Already have an Account?</a></small>
    </form>

    <!-- Forgot Password -->
    <form class="box animated tile" id="box-reset">
        <h2 class="m-t-0 m-b-15">Reset Password</h2>
        <input type="email" class="login-control m-b-20" placeholder="Email Address">

        <button class="btn btn-sm m-r-5">Reset Password</button>

        <small><a class="box-switcher" data-switch="box-login" href="">Already have an Account?</a></small>
    </form>
</section>
