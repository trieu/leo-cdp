<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Auth extends MY_Controller {

	public $data;
	function __construct()
	{
		parent::__construct();
		$this->load->database();
		$this->load->model('Users_model');
		$this->load->library(array('ion_auth','form_validation'));
		$this->load->helper(array('url','language'));
		$this->form_validation->set_error_delimiters($this->config->item('error_start_delimiter', 'ion_auth'), $this->config->item('error_end_delimiter', 'ion_auth'));
		$this->lang->load('auth');
	}

	//redirect if needed, otherwise display the user list
	function index()
	{

		if (!$this->ion_auth->logged_in())
		{
			//redirect them to the login page
			redirect('admin_auth/auth/login', 'refresh');
		}
		elseif (!$this->ion_auth->is_admin()) //remove this elseif if you want to enable this for non-admins
		{
			//redirect them to the home page because they must be an administrator to view this
			return show_error('You must be an administrator to view this page.');
		}
		else
		{
			//set the flash data error message if there is one
			$data['message'] = (validation_errors()) ? validation_errors() : $this->session->flashdata('message');

			//list the users
			$data['users'] = $this->ion_auth->users()->result();
			foreach ($data['users'] as $k => $user)
			{
				$data['users'][$k]->groups = $this->ion_auth->get_users_groups($user->id)->result();
			}

			$this->data['the_view_content'] = 'admin_auth/index';
			$this->_render_page('template/login_master_view');
		}
	}

	//log the user in
	function login()
	{
		$this->data['title'] = "Login";
		$this->data['page_title'] = 'Login';
		$this->data['module'] = 'auth';
		$this->data['view_file'] = 'login';
		//validate form input
		$this->form_validation->set_rules('identity', 'Identity', 'required');
		$this->form_validation->set_rules('password', 'Password', 'required');
//		$this->ion_auth->register('admin', '123456', 'truongmi@mith.com', array( 'first_name' => 'Truong', 'last_name' => 'Mi' ), array('1') );

		if ($this->form_validation->run() == true)
		{
			//check to see if the user is logging in
			//check for "remember me"
			$remember = (bool) $this->input->post('remember');
//			$remember = TRUE;
			if ($this->ion_auth->login($this->input->post('identity'), $this->input->post('password'), $remember))
			{
				//if the login is successful
				//redirect them back to the home page
				$this->session->set_flashdata('message', $this->ion_auth->messages());
				redirect('/', 'refresh');
			}
			else
			{
				//if the login was un-successful
				//redirect them back to the login page
				$this->session->set_flashdata('message', $this->ion_auth->errors());
				redirect('admin_auth/auth/login', 'refresh'); //use redirects instead of loading views for compatibility with MY_Controller libraries
//        echo Modules::run('templates', $data);
			}
		}
		else
		{
			//the user is not logging in so display the login page
			//set the flash data error message if there is one
			$this->data['message'] = (validation_errors()) ? validation_errors() : $this->session->flashdata('message');

			$this->data['the_view_content'] = 'admin_auth/login';
			$this->_render_page('template/admin_master_view',$this->data);
		}
	}

	public function profile()
	{
		$this->data['page_title'] = 'User Profile';
		$user = $this->ion_auth->user()->row();
//		var_dump($user);die;

		$this->data['user'] = $user;
		$this->data['current_user_menu'] = '';
		if($this->ion_auth->in_group('superAdmin'))
		{
			$this->data['current_user_menu'] = $this->load->view('template/_parts/user_menu_admin_view.php', NULL, TRUE);
		}

		$this->load->library('form_validation');
		$this->form_validation->set_rules('first_name','First name','trim');
		$this->form_validation->set_rules('last_name','Last name','trim');
		$this->form_validation->set_rules('company','Company','trim');
		$this->form_validation->set_rules('phone','Phone','trim');

		if($this->form_validation->run()===FALSE)
		{
//            $this->render('admin/user/profile_view','admin_master');
			$this->render('admin_user/profile_view',$this->data);
		}
		else
		{
			$new_data = array(
				'first_name' => $this->input->post('first_name'),
				'last_name'  => $this->input->post('last_name'),
				'company'    => $this->input->post('company'),
				'phone'      => $this->input->post('phone')
			);
			if(strlen($this->input->post('password'))>=6) $new_data['password'] = $this->input->post('password');
			$this->ion_auth->update($user->id, $new_data);

			$this->session->set_flashdata('message', $this->ion_auth->messages());
			redirect('admin/user/profile','refresh');

		}
	}
	//log the user out
	function logout()
	{
//		$data['title'] = "Logout";

		//log the user out
//		$logout = $this->ion_auth->logout();
		$this->ion_auth->logout();

		//redirect them to the login page
		$this->session->set_flashdata('message', $this->ion_auth->messages());
//		redirect('auth/login', 'refresh');
		redirect('/', 'refresh');
	}

	//change password
	function change_password()
	{
		$data['title'] = "Change Password";
		$data['page_title'] = 'Change Password';
		$data['module'] = 'auth';
		$data['view_file'] = 'change_password';

		$this->form_validation->set_rules('old', $this->lang->line('change_password_validation_old_password_label'), 'required');
		$this->form_validation->set_rules('new', $this->lang->line('change_password_validation_new_password_label'), 'required|min_length[' . $this->config->item('min_password_length', 'ion_auth') . ']|max_length[' . $this->config->item('max_password_length', 'ion_auth') . ']|matches[new_confirm]');
		$this->form_validation->set_rules('new_confirm', $this->lang->line('change_password_validation_new_password_confirm_label'), 'required');

		if (!$this->ion_auth->logged_in())
		{
			redirect('auth/login', 'refresh');
		}

		$user = $this->ion_auth->user()->row();

		if ($this->form_validation->run() == false)
		{
			//display the form
			//set the flash data error message if there is one
			$data['message'] = (validation_errors()) ? validation_errors() : $this->session->flashdata('message');

			$data['min_password_length'] = $this->config->item('min_password_length', 'ion_auth');
			$data['old_password'] = array(
				'name' => 'old',
				'id'   => 'old',
				'type' => 'password',
			);
			$data['new_password'] = array(
				'name' => 'new',
				'id'   => 'new',
				'type' => 'password',
				'pattern' => '^.{'.$data['min_password_length'].'}.*$',
			);
			$data['new_password_confirm'] = array(
				'name' => 'new_confirm',
				'id'   => 'new_confirm',
				'type' => 'password',
				'pattern' => '^.{'.$data['min_password_length'].'}.*$',
			);
			$data['user_id'] = array(
				'name'  => 'user_id',
				'id'    => 'user_id',
				'type'  => 'hidden',
				'value' => $user->id,
			);

			//render
//			$this->_render_page('auth/change_password', $data);

			echo Modules::run('templates', $data);
		}
		else
		{
			$identity = $this->session->userdata('identity');

			$change = $this->ion_auth->change_password($identity, $this->input->post('old'), $this->input->post('new'));

			if ($change)
			{
				//if the password was successfully changed
				$this->session->set_flashdata('message', $this->ion_auth->messages());
				$this->logout();
			}
			else
			{
				$this->session->set_flashdata('message', $this->ion_auth->errors());
				redirect('auth/change_password', 'refresh');
			}
		}
	}

	//forgot password
	function forgot_password()
	{
		$data['title'] = "Forgotten Password";
		$data['page_title'] = 'Forgotten Password';
		$data['module'] = 'auth';
		$data['view_file'] = 'forgot_password';

		//setting validation rules by checking wheather identity is username or email
		if($this->config->item('identity', 'ion_auth') == 'username' )
		{
			$this->form_validation->set_rules('email', $this->lang->line('forgot_password_username_identity_label'), 'required');
		}
		else
		{
			$this->form_validation->set_rules('email', $this->lang->line('forgot_password_validation_email_label'), 'required|valid_email');
		}


		if ($this->form_validation->run() == false)
		{
			//setup the input
			$data['email'] = array('name' => 'email',
				'id' => 'email',
			);

			if ( $this->config->item('identity', 'ion_auth') == 'username' ){
				$data['identity_label'] = $this->lang->line('forgot_password_username_identity_label');
			}
			else
			{
				$data['identity_label'] = $this->lang->line('forgot_password_email_identity_label');
			}

			//set any errors and display the form
			$data['message'] = (validation_errors()) ? validation_errors() : $this->session->flashdata('message');
//			$this->_render_page('auth/forgot_password', $data);
			echo Modules::run('templates', $data);

		}
		else
		{
			// get identity from username or email
			if ( $this->config->item('identity', 'ion_auth') == 'username' ){
				$identity = $this->ion_auth->where('username', strtolower($this->input->post('email')))->users()->row();
			}
			else
			{
				$identity = $this->ion_auth->where('email', strtolower($this->input->post('email')))->users()->row();
			}
			if(empty($identity)) {

				if($this->config->item('identity', 'ion_auth') == 'username')
				{
					$this->ion_auth->set_message('forgot_password_username_not_found');
				}
				else
				{
					$this->ion_auth->set_message('forgot_password_email_not_found');
				}

				$this->session->set_flashdata('message', $this->ion_auth->messages());
				redirect("auth/forgot_password", 'refresh');
			}

			//run the forgotten password method to email an activation code to the user
			$forgotten = $this->ion_auth->forgotten_password($identity->{$this->config->item('identity', 'ion_auth')});

			if ($forgotten)
			{
				//if there were no errors
				$this->session->set_flashdata('message', $this->ion_auth->messages());
				redirect("auth/login", 'refresh'); //we should display a confirmation page here instead of the login page
			}
			else
			{
				$this->session->set_flashdata('message', $this->ion_auth->errors());
				redirect("auth/forgot_password", 'refresh');
			}
		}
	}

	//reset password - final step for forgotten password
	public function reset_password($code = NULL)
	{
		$data['title'] = "Reset Password";
		$data['page_title'] = 'Reset Password';
		$data['module'] = 'auth';
		$data['view_file'] = 'reset_password';

		if (!$code)
		{
			show_404();
		}

		$user = $this->ion_auth->forgotten_password_check($code);

		if ($user)
		{
			//if the code is valid then display the password reset form

			$this->form_validation->set_rules('new', $this->lang->line('reset_password_validation_new_password_label'), 'required|min_length[' . $this->config->item('min_password_length', 'ion_auth') . ']|max_length[' . $this->config->item('max_password_length', 'ion_auth') . ']|matches[new_confirm]');
			$this->form_validation->set_rules('new_confirm', $this->lang->line('reset_password_validation_new_password_confirm_label'), 'required');

			if ($this->form_validation->run() == false)
			{
				//display the form

				//set the flash data error message if there is one
				$data['message'] = (validation_errors()) ? validation_errors() : $this->session->flashdata('message');

				$data['min_password_length'] = $this->config->item('min_password_length', 'ion_auth');
				$data['new_password'] = array(
					'name' => 'new',
					'id'   => 'new',
					'type' => 'password',
					'pattern' => '^.{'.$data['min_password_length'].'}.*$',
				);
				$data['new_password_confirm'] = array(
					'name' => 'new_confirm',
					'id'   => 'new_confirm',
					'type' => 'password',
					'pattern' => '^.{'.$data['min_password_length'].'}.*$',
				);
				$data['user_id'] = array(
					'name'  => 'user_id',
					'id'    => 'user_id',
					'type'  => 'hidden',
					'value' => $user->id,
				);
				$data['csrf'] = $this->_get_csrf_nonce();
				$data['code'] = $code;

				//render
//				$this->_render_page('auth/reset_password', $data);
				echo Modules::run('templates', $data);
			}
			else
			{
				// do we have a valid request?
				if ($this->_valid_csrf_nonce() === FALSE || $user->id != $this->input->post('user_id'))
				{

					//something fishy might be up
					$this->ion_auth->clear_forgotten_password_code($code);

					show_error($this->lang->line('error_csrf'));

				}
				else
				{
					// finally change the password
					$identity = $user->{$this->config->item('identity', 'ion_auth')};

					$change = $this->ion_auth->reset_password($identity, $this->input->post('new'));

					if ($change)
					{
						//if the password was successfully changed
						$this->session->set_flashdata('message', $this->ion_auth->messages());
						$this->logout();
					}
					else
					{
						$this->session->set_flashdata('message', $this->ion_auth->errors());
						redirect('auth/reset_password/' . $code, 'refresh');
					}
				}
			}
		}
		else
		{
			//if the code is invalid then send them back to the forgot password page
			$this->session->set_flashdata('message', $this->ion_auth->errors());
			redirect("auth/forgot_password", 'refresh');
		}
	}


	//activate the user
	function activate($id, $code=false)
	{
		if ($code !== false)
		{
			$activation = $this->ion_auth->activate($id, $code);
		}
		else if ($this->ion_auth->is_admin())
		{
			$activation = $this->ion_auth->activate($id);
		}

		if ($activation)
		{
			//redirect them to the auth page
			$this->session->set_flashdata('message', $this->ion_auth->messages());
			redirect("auth", 'refresh');
		}
		else
		{
			//redirect them to the forgot password page
			$this->session->set_flashdata('message', $this->ion_auth->errors());
			redirect("auth/forgot_password", 'refresh');
		}
	}

	//deactivate the user
	function deactivate($id = NULL)
	{
		if (!$this->ion_auth->logged_in() || !$this->ion_auth->is_admin())
		{
			//redirect them to the home page because they must be an administrator to view this
			return show_error('You must be an administrator to view this page.');
		}

		$id = (int) $id;

		$this->load->library('form_validation');
		$this->form_validation->set_rules('confirm', $this->lang->line('deactivate_validation_confirm_label'), 'required');
		$this->form_validation->set_rules('id', $this->lang->line('deactivate_validation_user_id_label'), 'required|alpha_numeric');

		if ($this->form_validation->run() == FALSE)
		{
			// insert csrf check
			$data['csrf'] = $this->_get_csrf_nonce();
			$data['user'] = $this->ion_auth->user($id)->row();

			$this->_render_page('auth/deactivate_user', $data);
		}
		else
		{
			// do we really want to deactivate?
			if ($this->input->post('confirm') == 'yes')
			{
				// do we have a valid request?
				if ($this->_valid_csrf_nonce() === FALSE || $id != $this->input->post('id'))
				{
					show_error($this->lang->line('error_csrf'));
				}

				// do we have the right userlevel?
				if ($this->ion_auth->logged_in() && $this->ion_auth->is_admin())
				{
					$this->ion_auth->deactivate($id);
				}
			}

			//redirect them back to the auth page
			redirect('auth', 'refresh');
		}
	}

	//create a new user
	function create_user()
	{
		$this->data['title'] = "Create User";

		if (!$this->ion_auth->logged_in() || !$this->ion_auth->is_admin())
		{
			redirect('admin_auth/auth/login', 'refresh');
		}

		$tables = $this->config->item('tables','ion_auth');

		//validate form input
		$this->form_validation->set_rules('first_name', $this->lang->line('create_user_validation_fname_label'), 'required');
		$this->form_validation->set_rules('last_name', $this->lang->line('create_user_validation_lname_label'), 'required');
		$this->form_validation->set_rules('email', $this->lang->line('create_user_validation_email_label'), 'required|valid_email|is_unique['.$tables['users'].'.email]');
		$this->form_validation->set_rules('phone', $this->lang->line('create_user_validation_phone_label'), 'required');
		$this->form_validation->set_rules('company', $this->lang->line('create_user_validation_company_label'), 'required');
		$this->form_validation->set_rules('password', $this->lang->line('create_user_validation_password_label'), 'required|min_length[' . $this->config->item('min_password_length', 'ion_auth') . ']|max_length[' . $this->config->item('max_password_length', 'ion_auth') . ']|matches[password_confirm]');
		$this->form_validation->set_rules('password_confirm', $this->lang->line('create_user_validation_password_confirm_label'), 'required');

		if ($this->form_validation->run() == true)
		{
			$username = strtolower($this->input->post('first_name')) . ' ' . strtolower($this->input->post('last_name'));
			$email    = strtolower($this->input->post('email'));
			$password = $this->input->post('password');

			$additional_data = array(
				'first_name' => $this->input->post('first_name'),
				'last_name'  => $this->input->post('last_name'),
				'company'    => $this->input->post('company'),
				'phone'      => $this->input->post('phone'),
			);
		}

		if ($this->form_validation->run() == true && $this->ion_auth->register($username, $password, $email, $additional_data))
		{
			//check to see if we are creating the user
			//redirect them back to the admin page
			$this->session->set_flashdata('message', $this->ion_auth->messages());
		//	redirect("auth", 'refresh');
			echo json_encode(array("status" => TRUE));
		}
		else
		{
			//display the create user form
			//set the flash data error message if there is one
			$this->data['message'] = (validation_errors() ? validation_errors() : ($this->ion_auth->errors() ? $this->ion_auth->errors() : $this->session->flashdata('message')));
			$data = array(
				"status" => FALSE,
				'first_name' => form_error('first_name'),
				'last_name' => form_error('last_name'),
				'email' => form_error('email'),
				'phone' => form_error('phone'),
				'company' => form_error('company'),
				'password' => form_error('password'),
				'password_confirm' => form_error('password_confirm')
			);
			//echo json_encode(array("status" => FALSE));
			echo json_encode($data);
			exit();
		}
	}

	//edit a user
	function edit_user()
	{
		$id=$this->input->post('id');

		$data['title'] = "Edit User";
		$data['page_title'] = 'Edit User';
		$data['module'] = 'auth';
		$data['view_file'] = 'edit_user';

		if (!$this->ion_auth->logged_in() || (!$this->ion_auth->is_admin() && !($this->ion_auth->user()->row()->id == $id)))
		{
			redirect('admin_auth/auth/login', 'refresh');
		}

		$user = $this->ion_auth->user($id)->row();

		//validate form input
		$this->form_validation->set_rules('first_name', $this->lang->line('edit_user_validation_fname_label'), 'required');
		$this->form_validation->set_rules('last_name', $this->lang->line('edit_user_validation_lname_label'), 'required');
		$this->form_validation->set_rules('phone', $this->lang->line('edit_user_validation_phone_label'), 'required');
		$this->form_validation->set_rules('company', $this->lang->line('edit_user_validation_company_label'), 'required');

		if (isset($_POST) && !empty($_POST))
		{
			// do we have a valid request?
//			if ($this->_valid_csrf_nonce() === FALSE || $id != $this->input->post('id'))
//			{
//
//				show_error($this->lang->line('error_csrf'));
//			}

			//update the password if it was posted
			if ($this->input->post('password'))
			{
				$this->form_validation->set_rules('password', $this->lang->line('edit_user_validation_password_label'), 'required|min_length[' . $this->config->item('min_password_length', 'ion_auth') . ']|max_length[' . $this->config->item('max_password_length', 'ion_auth') . ']|matches[password_confirm]');
				$this->form_validation->set_rules('password_confirm', $this->lang->line('edit_user_validation_password_confirm_label'), 'required');
			}

			if ($this->form_validation->run() === TRUE)
			{
				$data = array(
					'first_name' => $this->input->post('first_name'),
					'last_name'  => $this->input->post('last_name'),
					'company'    => $this->input->post('company'),
					'phone'      => $this->input->post('phone'),
				);


				//update the password if it was posted
				if ($this->input->post('password'))
				{
					$data['password'] = $this->input->post('password');
				}



				// Only allow updating groups if user is admin
				if ($this->ion_auth->is_admin())
				{
					//Update the groups user belongs to
					$groupData = $this->input->post('groups');

					if (isset($groupData) && !empty($groupData)) {

						$this->ion_auth->remove_from_group('', $id);

						foreach ($groupData as $grp) {
							$this->ion_auth->add_to_group($grp, $id);
						}

					}
				}

				//check to see if we are updating the user
				if($this->ion_auth->update($user->id, $data))
				{
					//redirect them back to the admin page if admin, or to the base url if non admin
					//$this->session->set_flashdata('message', $this->ion_auth->messages() );
					echo json_encode(array("status" => TRUE));
					exit();
				}
				else
				{
					//redirect them back to the admin page if admin, or to the base url if non admin
//					$this->session->set_flashdata('message', $this->ion_auth->errors() );
//					if ($this->ion_auth->is_admin())
//					{
//						redirect('auth', 'refresh');
//					}
//					else
//					{
//						redirect('/', 'refresh');
//					}
					$data = array(
						"status" => FALSE,
						'errors' => $this->ion_auth->errors()
					);
					echo json_encode($data);
					exit();
				}

			}
		}

		//display the edit user form
		$data['csrf'] = $this->_get_csrf_nonce();

		//set the flash data error message if there is one
		$data['message'] = (validation_errors() ? validation_errors() : ($this->ion_auth->errors() ? $this->ion_auth->errors() : $this->session->flashdata('message')));

		//pass the user to the view
		$data['user'] = $user;
//		$data['groups'] = $groups;
//		$data['currentGroups'] = $currentGroups;
//		$data['the_view_content'] = 'admin_auth/edit_user_view';
//		$this->_render_page('template/master_view',$data);
		echo json_encode($user);


	}
	// get current group by id user
	function get_current_group()
	{
		$id=$this->input->post('id');
		$currentGroups = $this->ion_auth->get_users_groups($id)->result();
		echo json_encode($currentGroups);
	}

	// create a new group
	function create_group()
	{
		$data['title'] = $this->lang->line('create_group_title');

		if (!$this->ion_auth->logged_in() || !$this->ion_auth->is_admin())
		{
			redirect('auth', 'refresh');
		}

		//validate form input
		$this->form_validation->set_rules('group_name', $this->lang->line('create_group_validation_name_label'), 'required|alpha_dash');

		if ($this->form_validation->run() == TRUE)
		{
			$new_group_id = $this->ion_auth->create_group($this->input->post('group_name'), $this->input->post('description'));
			if($new_group_id)
			{
				// check to see if we are creating the group
				// redirect them back to the admin page
				$this->session->set_flashdata('message', $this->ion_auth->messages());
				redirect("auth", 'refresh');
			}
		}
		else
		{
			//display the create group form
			//set the flash data error message if there is one
			$data['message'] = (validation_errors() ? validation_errors() : ($this->ion_auth->errors() ? $this->ion_auth->errors() : $this->session->flashdata('message')));

			$data['group_name'] = array(
				'name'  => 'group_name',
				'id'    => 'group_name',
				'type'  => 'text',
				'value' => $this->form_validation->set_value('group_name'),
			);
			$data['description'] = array(
				'name'  => 'description',
				'id'    => 'description',
				'type'  => 'text',
				'value' => $this->form_validation->set_value('description'),
			);

			$this->_render_page('auth/create_group', $data);
		}
	}

	//edit a group
	function edit_group($id)
	{
		// bail if no group id given
		if(!$id || empty($id))
		{
			redirect('auth', 'refresh');
		}

		$data['title'] = $this->lang->line('edit_group_title');

		if (!$this->ion_auth->logged_in() || !$this->ion_auth->is_admin())
		{
			redirect('auth', 'refresh');
		}

		$group = $this->ion_auth->group($id)->row();

		//validate form input
		$this->form_validation->set_rules('group_name', $this->lang->line('edit_group_validation_name_label'), 'required|alpha_dash');

		if (isset($_POST) && !empty($_POST))
		{
			if ($this->form_validation->run() === TRUE)
			{
				$group_update = $this->ion_auth->update_group($id, $_POST['group_name'], $_POST['group_description']);

				if($group_update)
				{
					$this->session->set_flashdata('message', $this->lang->line('edit_group_saved'));
				}
				else
				{
					$this->session->set_flashdata('message', $this->ion_auth->errors());
				}
				redirect("auth", 'refresh');
			}
		}

		//set the flash data error message if there is one
		$data['message'] = (validation_errors() ? validation_errors() : ($this->ion_auth->errors() ? $this->ion_auth->errors() : $this->session->flashdata('message')));

		//pass the user to the view
		$data['group'] = $group;

		$data['group_name'] = array(
			'name'  => 'group_name',
			'id'    => 'group_name',
			'type'  => 'text',
			'value' => $this->form_validation->set_value('group_name', $group->name),
		);
		$data['group_description'] = array(
			'name'  => 'group_description',
			'id'    => 'group_description',
			'type'  => 'text',
			'value' => $this->form_validation->set_value('group_description', $group->description),
		);

		$this->_render_page('auth/edit_group', $data);
	}


	function _get_csrf_nonce()
	{
		$this->load->helper('string');
		$key   = random_string('alnum', 8);
		$value = random_string('alnum', 20);
		$this->session->set_flashdata('csrfkey', $key);
		$this->session->set_flashdata('csrfvalue', $value);

		return array($key => $value);
	}

	function List_User()
	{
		$this->data['the_view_content'] = 'admin_auth/List_User';
		//$this->data['javascript']='admin_auth/admin_auth_javascript';
		$this->data['groups'] = $this->ion_auth->groups()->result();
		$this->data['javascript']='admin_auth/create_user_view';
		$this->_render_page('template/master_view', $this->data);
	}

	// Load du lieu thei kieu ajax
	function  getAjax(){
		$query =$this->db->select('users.id as ID, users.username as Username,users.email as Email,users.active as Active,groups.name as GroupName, groups.id as GroupId')
						 ->from('users_groups')
						 ->join('users','users.id = users_groups.user_id','inner')
						 ->join('groups','groups.id=users_groups.group_id','inner')
						->get()->result_object();
		// $this->Users_model->listUsers();
//		print_r($query);
//		$this->output->enable_profiler(TRUE);


		$count =$this->db->select('*')->from('users')->count_all_results();
		$num_row=1;
		$data = array();
		// $no = $_POST['start'];
		foreach ($query as $user) {
			//  $no++;
			$row = array();
			$row[] = $user->ID;
			$row[] ='<a href="javascript:void()" onclick="getByID('."'".$user->ID."'".')">'.$user->Username.'</a>';
			$row[] = $user->Email;
			$row[] = $user->GroupName;
			if($user->Active==1)
			{
				$row[] = '<a class="btn btn-sm btn-primary btn-grid" href="javascript:void()" title="Edit" onclick="getByIdUser('."'".$user->ID."'".')"><i class="glyphicon glyphicon-pencil"></i> Edit</a>'.
						 '<a class="btn btn-sm btn-primary btn-grid" href="javascript:void()" title="Lock" onclick="LockAndUnlockUser('."'".$user->ID."'".')"><i class="glyphicon glyphicon-pencil"></i> Lock</a>';

			}else{
				$row[] = '<a class="btn btn-sm btn-primary btn-grid" href="javascript:void()" title="Edit" onclick="getByID('."'".$user->ID."'".')"><i class="glyphicon glyphicon-pencil"></i> Edit</a>'.
					'<a class="btn btn-sm btn-primary btn-grid" href="javascript:void()" title="Un Lock" onclick="LockAndUnlockUser('."'".$user->ID."'".')"><i class="glyphicon glyphicon-pencil"></i>Un Lock</a>';

			}

			$data[] = $row;
		}

		$output = array(

			"recordsTotal" => $count,
			"recordsFiltered" => $num_row,
			"data" => $data,
		);
		//output to json format
		echo json_encode($output);

	}
	function LockAndUnlockUser(){
		$id=$this->input->post('id');

		$query = $this->db->select("*")
			->from("users")
			->where('id',$id)
			->get()->result_object();

		if($query!==null)
		{
			if($query[0]->active==1)
			{
				//echo 'aaaaaaaaaaaa';die;
				// update lai trang thai cua user
				$query[0]->active=0;
				$this->db->where('id', $query[0]->id)
				->update('users', $query[0]);
			}else
			{
				$query[0]->active=1;
				$this->db->where('id', $query[0]->id)
					->update('users', $query[0]);
			}

		}

	}
	function _valid_csrf_nonce()
	{
		if ($this->input->post($this->session->flashdata('csrfkey')) !== FALSE &&
			$this->input->post($this->session->flashdata('csrfkey')) == $this->session->flashdata('csrfvalue'))
		{
			return TRUE;
		}
		else
		{
			return FALSE;
		}
	}

	function _render_page($view, $data=null, $render=false)
	{

		$this->viewdata = (empty($data)) ? $data: $data;

		$view_html = $this->load->view($view, $this->viewdata, $render);

		if (!$render) return $view_html;
	}
	function render($the_view = NULL,$data=null, $template = 'master')
	{
		if(is_null($template))
		{
			$this->load->view($the_view,$data);
		}
		else
		{
			$data['the_view_content'] = (is_null($the_view)) ? '' : $this->load->view($the_view, $data, TRUE);
			$this->load->view('template/' . $template . '_view', $data);
		}
	}

}
