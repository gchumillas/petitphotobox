<?php
namespace petitphotobox\controllers;
use petitphotobox\core\controller\AuthController;
use petitphotobox\core\exception\AppError;
use petitphotobox\core\exception\ClientException;
use petitphotobox\model\documents\CategoryEditDocument;
use petitphotobox\model\records\DbCategory;
use soloproyectos\text\Text;

class CategoryEditController extends AuthController
{
  private $_document;
  private $_record;

  /**
   * Creates a new instance..
   */
  public function __construct()
  {
    parent::__construct();
    $this->addOpenRequestHandler([$this, "onOpenRequest"]);
    $this->addPostRequestHandler([$this, "onPostRequest"]);
  }

  /**
   * {@inheritdoc}
   *
   * @return CategoryEditDocument
   */
  public function getDocument()
  {
    return $this->_document;
  }

  /**
   * Processes OPEN requests.
   *
   * @return void
   */
  public function onOpenRequest()
  {
    $id = $this->getParam("categoryId");

    $this->_record = new DbCategory($this->db, $id);
    $this->_document = new CategoryEditDocument($this->_record, $this->user);
  }

  /**
   * Processes POST requests.
   *
   * @return void
   */
  public function onPostRequest()
  {
    $parentId = $this->getParam("parentCategoryId");
    $title = $this->getParam("title");

    if (Text::isEmpty($title)) {
      throw new ClientException("Title is required");
    }

    $parent = new DbCategory($this->db, $parentId);
    if (Text::isEmpty($parentId)) {
      $parent = Text::isEmpty($this->_record->getId())
        ? $this->user->getMainCategory()
        : $this->_record->getParent();
    }

    if (Text::isEmpty($parent->getId())) {
      throw new ClientException("Parent category not found");
    }

    $this->_record->setUser($this->user);
    $this->_record->setParent($parent);
    $this->_record->setTitle($title);
    $this->_record->save();
  }
}