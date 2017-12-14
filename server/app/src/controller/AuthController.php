<?php
namespace petitphotobox\controller;
use petitphotobox\auth\User;
use petitphotobox\controller\BaseController;
use petitphotobox\exceptions\SessionError;

class AuthController extends BaseController
{
  public $user;

  /**
   * Constructor.
   */
  public function __construct()
  {
    parent::__construct();

    // processes the initial request
    $this->on("OPEN", function () {
      $this->user = User::getInstance();

      if ($this->user === null) {
        $this->appError(new SessionError("Your session has expired"));
      }
    });
  }
}
