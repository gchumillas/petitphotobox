<?php
namespace petitphotobox\core\controller;
use petitphotobox\core\exception\AppError;
use petitphotobox\core\exception\ClientException;
use petitphotobox\core\http\HttpClient;
use petitphotobox\exceptions\DatabaseError;
use petitphotobox\core\model\Document;
use soloproyectos\db\DbConnector;
use soloproyectos\db\exception\DbException;
use soloproyectos\http\controller\HttpController;
use soloproyectos\i18n\translator\I18nTranslator;
use soloproyectos\text\Text;

class Controller extends HttpController
{
  /**
   * Database connection.
   * @var DbConnector
   */
  protected $db;

  /**
   * Translator.
   * @var I18nTranslator
   */
  protected $translator;

  /**
   * Document.
   * @var Document
   */
  private $_document;

  /**
   * Creates a new instance.
   */
  public function __construct()
  {
    parent::__construct();
    $this->_document = new Document();

    $this->addOpenRequestHandler(function () {
      try {
        $this->translator = new I18nTranslator();
        $this->translator->loadDictionaries(I18N_DIR, I18N_DEFAULT_LANG);

        // gets current language
        $lang = $this->getCookie("lang");
        if (Text::isEmpty($lang)) {
          $lang = HttpClient::getLanguage();
        }

        $this->useLang($lang);

        $this->db = new DbConnector(DBNAME, DBUSER, DBPASS, DBHOST);
      } catch (DbException $e) {
        throw new DatabaseError($e->getMessage());
      }
    });
  }

  /**
   * Uses an specific language.
   *
   * @param string $lang Language
   *
   * @return void
   */
  public function useLang($lang)
  {
    $langs = $this->translator->getLangs();

    if (in_array($lang, $langs)) {
      $this->translator->useLang($lang);
      $this->setCookie("lang", $lang);
    }
  }

  /**
   * {@inheritdoc}
   *
   * @param string $name     Parameter name
   * @param string $defValue Default value
   *
   * @return mixed
   */
  public function getParam($name, $defValue = null)
  {
      return trim(parent::getParam($name, $defValue));
  }

  /**
   * Gets the current document.
   *
   * @return mixed
   */
  public function getDocument()
  {
    return $this->_document;
  }

  /**
   * {@inheritdoc}
   *
   * @return void
   */
  public function processRequest()
  {
    try {
      parent::processRequest();
    } catch (ClientException $e) {
      header("HTTP/1.0 400 Client Error");
      header("Content-Type: text/plain; charset=utf-8");

      $doc = $this->getDocument();
      $doc->setStatusCode($e->getCode());
      $doc->setStatusMessage($this->translator->get($e->getMessage()));
      echo $doc;

      throw $e;
    } catch (AppError $e) {
      header("HTTP/1.0 500 Application Error");
      header("Content-Type: text/plain; charset=utf-8");

      $doc = new Document();
      $doc->setStatusCode($e->getCode());
      $doc->setStatusMessage($this->translator->get($e->getMessage()));
      echo $doc;

      throw $e;
    }

    echo $this->getDocument();
  }
}
