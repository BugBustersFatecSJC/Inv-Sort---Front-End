import { useEffect, useState } from 'react'
import './ProductCategory.module.css'
import styles from './ProductCategory.module.css'
import api from '../../services/api'
import Loading from '../Loading/Loading'
import Modal from '../Modal/Modal'
import 'react-tippy/dist/tippy.css'
import { Tooltip } from 'react-tippy'
import FlashMessage from '../FlashMessage/FlashMessage'
import { useNavigate } from 'react-router-dom'
import ShortModal from '../ShortModal/ShortModal'
import DeleteConfirmationModal from '../DeleteConfirmationModal/DeleteConfirmationModal'


/******************************************************************************
 * Componente que exibe o container da categoria com os produtos dentro       *
 *****************************************************************************/

function ProductCategory(props) {
  const [imagePreview, setImagePreview] = useState(null)
  /**
   * Criação da renderização do componente de loading
   */
   const [loading, setLoading] = useState(true)

  /**
   * Criação dos quadrados dos produtos no inventário
   */
  const [products, setProducts] = useState([]) // Aqui, em vez de `squares`, use `products`
  const [windowWidth,setWindowWidth] = useState(window.innerWidth)
  const fetchProducts = async () => {
    try {
      const response = await api.get('/products')
      setProducts(response.data) // Armazena os produtos diretamente no estado
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }
    /**
     * Renderização da flash message
     */
    const [flash, setFlash] = useState(null)

    const showFlashMessage = (message, type) => {
      setFlash(null)
      setTimeout(() => {
          setFlash({ message, type })
      }, 0)
    }

    const flashSuccess = () => {
      showFlashMessage('Item adicionado com sucesso!','success');
    }

    const flashError = () => {
      showFlashMessage('Um erro aconteceu','error');
    };

    const flashInfo = () => {
      showFlashMessage('Item atualizado', 'info');
    }

    const flashDelete = () => {
      showFlashMessage('Item deletado', 'success');
    }
    
    /**
     * Retorna todas as unidades
     */
    const [units, setUnits] = useState([])

    const fetchUnits = async () => {
      try {
        await api
          .get('/unit')
          .then(response => setUnits(response.data))
      } catch(err) {
          console.log(err)
      }
    }
    
    /**
     * Retorna todos os fornecedores
    */
   
   const [suppliers, setSuppliers] = useState([])
   
   const fetchSuppliers = async () => {
     try {
       await api
       .get('/supplier')
       .then(response => setSuppliers(response.data))
      } catch(err) {
        console.log(err)
      }
    }

    /**
     * Retorna todos os setores
    */
   
    const [sectors, setSector] = useState([])
      
    const fetchSector = async () => {
      try {
        await api
        .get('/sector')
        .then(response => setSector(response.data))
      } catch(err) {
        console.log(err)
      }
    }

 /**
     * Retorna todos os setores
    */
   
 const [batch, setBatch] = useState([])
      
 const fetchBatch = async () => {
   try {
     await api
     .get('/batch')
     .then(response => setBatch(response.data))
   } catch(err) {
     console.log(err)
   }
 }

    /**
     * Retorna todos os locais
    */
   
   const [local, setLocals] = useState([])
   
   const fetchLocals = async () => {
     try {
       await api
       .get('/local')
       .then(response => setLocals(response.data))
      } catch(err) {
        console.log(err)
      }
    }

    /**
     * Hook de useEffect para ativar as funções quando o componente é renderizado
     */
    useEffect(() => {
      const fetchData = async () => {
        setLoading(true)
        await fetchUnits()
        await fetchSuppliers()
        await fetchProducts()
        await fetchSector()
        await fetchLocals()
        await fetchBatch()

      }

      fetchData()
    }, [])
    useEffect(() => {
      const handleResize = () => {
        setWindowWidth(window.innerWidth)
      }

      window.addEventListener('resize', handleResize)
      return () => {
        window.removeEventListener('resize', handleResize)
      }
    })
    /**
     * Abre e fecha o modal de produtos
     */
    const [isModalOpen, setIsModalOpen] = useState(false)

    const openModal = () => setIsModalOpen(true)
    const closeModal = () => setIsModalOpen(false)


    /**
     * Registra o produto
     */
    const [productName, setProductName] = useState('')
    const [productDescription, setProductDescription] = useState(null)
    const [productUnitId, setProductUnitId] = useState('')
    const [productSupplierId, setProductSupplierId] = useState('')
    const [isPerishable, setIsPerishable] = useState(false)
    const [productBrand, setProductBrand] = useState('');
    const [productModel, setProductModel] = useState('');
    const [productCostValue, setProductCostValue] = useState(0);
    const [productSellValue, setProductSellValue] = useState(0);
    const [productLocalId, setProductLocalId] = useState('');
    const [productSectorId, setProductSectorId] = useState('');
   // const [productBatchId, setProductBatchId] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    

    const handleSubmit = async(e) => {
      e.preventDefault()

      const ProductData = {
          product_name: productName,
          description: productDescription,
          category_id: props.categoryKey,
          supplier_id: productSupplierId,
          is_perishable: isPerishable,
          unit_id: productUnitId,
          prod_model: productModel,
          prod_brand: productBrand,
          prod_cost_value: productCostValue,
          prod_sell_valleu: productSellValue,
          local_id: productLocalId,
          sector_id: productSectorId,
         // batch_id: productBatchId
      }

      try {
          await api
          .post("/products", ProductData)
          .then(response => props.onProductAdded(response.data))          

          setProductName('')
          setProductDescription('')
          setProductUnitId('')
          setProductSupplierId('')
          setIsPerishable(false)
          //setProductBatchId('') 
          setProductSellValue('')
          setProductCostValue('')
          setProductSectorId('')
          setProductLocalId('')
          setProductBrand('')
          setProductModel('')
          closeModal()
          flashSuccess()
      } catch (err) {
          console.log(err)
          flashError()
      }
  }

  /**
   * Deleta o produto
   */
  const handleDelete = async (product_id) => {
    const user = localStorage.getItem("user")
    const jsonUser = JSON.parse(user)
    
    if (jsonUser.role === "admin"){
    
    try {
      await api
        .delete(`/products/${product_id}`)
        .then((response) => {console.log(response)})
        props.onProductDeleted(product_id)
        flashDelete()
    } catch (err) {
      console.log(err)
      flashError()
    }
  }
  else {alert ("Você não tem permissão para fazer isso")}
  }

  /**
   * Edição do produto
   */
  const [isProdEditModalOpen, setIsProdEditModalOpen] = useState(false)
  const [currentProduct, setCurrentProduct] = useState(null)

  const openProdEditModal = (product) => {
    setCurrentProduct(product)
    setProductName(product.product_name)
    setProductDescription(product.description)
    setProductUnitId(product.unit_id)
    setProductSupplierId(product.supplier_id)
    setIsPerishable(product.is_perishable)
    setProductCostValue(product.prod_cost_value); 
    setProductSellValue(product.prod_sell_value); 

    setIsProdEditModalOpen(true)
  }

  const closeProdEditModal = () => {
    setIsProdEditModalOpen(false)
    setCurrentProduct(null)
  }

  const handleProdUpdate = async (e) => {
    e.preventDefault()

    const updatedProductData = {
      product_name: productName,
      description: productDescription,
      category_id: props.categoryKey,
      supplier_id: productSupplierId,
      is_perishable: isPerishable,
      unit_id: productUnitId,
      prod_cost_value: productCostValue,
      prod_sell_value: productSellValue
    }

    
    try {
      await api
        .put(`/products/${currentProduct.product_id}`, updatedProductData)
        .then(response => console.log(response))
        

        /******************************************************************************
         * ATEÇÃO                                                                     *
         * TODO: Aqui está ocorrendo um erro com o react tippy (que faz o tooltip)    *
         * e a atualização dinâmica do componente, o erro em questão é que            *
         * o react tippy não consegue carregar código jsx depois de atualizar         *
         * o produto, então como quebra galho após a atualizaçaõ do produto, a página *
         * é recarregada, para mostrar as alterações                                  * 
         * TAMBÉM ACONTECE AO EXCLUIR :(                                              *
         ******************************************************************************/
        // window.location.reload()
        // props.onProductUpdated(currentProduct.product_id, updatedProductData)

        closeProdEditModal()
        flashInfo()
    } catch(err) {
      console.log(err)
      flashError()
    }
  }

  
  /**
   * Hover de cada produto
   */
  const [hoveredProductId, setHoveredProductId] = useState(null)

  /**
   * Funcionalidade de abrir o container de categoria
   */
  const [showCategoryProducts, setShowCategoryProducts] = useState(false)
  const id = props.categoryKey
  const navigate = useNavigate()
  const handleClickShow = () => {
    navigate('/buyandsell/'+id)
  }

  /**
  * Edição da categoria
  */
 const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
 const [categoryName, setCategoryName] = useState('')
 const [categoryImage, setCategoryImage] = useState(null)

 const openCategoryModal = (category) => {
   setCategoryName(category.category_name)

   const imageUrl = category.category_image ? `http://localhost:3001${category.category_image}` : null
   setCategoryImage(imageUrl)
   setImagePreview(imageUrl)

   console.log(imageUrl)

   setIsCategoryModalOpen(true)
 }
 const closeCategoryModal = () => {
   setCategoryImage(null)
   setCategoryName('')
   setIsCategoryModalOpen(false)
 }

 const handleCategoryUpdate = async(e) => {
     e.preventDefault()

     const formData = new FormData();
     formData.append('category_name', categoryName)
     formData.append('category_image', categoryImage)

     try {
         await api
         .put(`/category/${props.categoryKey}`, formData, {
           headers: {
             'Content-Type': 'multipart/form-data'
           }
         })
         .then(response => console.log(response))
         
         props.onCategoryUpdated(props.categoryKey, categoryName, categoryImage)

         closeCategoryModal()
         window.location.reload()
         flashInfo()
     } catch (err) {
         console.log(err)
         flashError()
     }
 }

  /**
   * Deleta a categoria
   */
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState(null)

  const confirmDeleteCategory = (categoryKey) => {
    setCategoryToDelete(categoryKey)
    setShowDeleteCategoryModal(true)
  }

  const handleDeleteCategoryCancel = () => {
      setCategoryToDelete(null)
      setShowDeleteCategoryModal(false)
  }

  const handleDeleteCategoryConfirm = async () => {
    if (!categoryToDelete) return;

    try {
        await api.delete(`/category/${categoryToDelete}`)
        props.onCategoryDeleted(categoryToDelete)
        flashInfo('Categoria excluída com sucesso!')
    } catch (err) {
        console.error(err)
        flashError('Erro ao excluir categoria.')
    } finally {
        setCategoryToDelete(null)
        setShowDeleteCategoryModal(false)
    }
  }

  const backgroundSizeOptions = ['100%', '100% 100%']

  const [backgroundSize] = useState(() => {
    const randomIndex = Math.floor(Math.random() * backgroundSizeOptions.length)
    return backgroundSizeOptions[randomIndex]
  })

    return (
      // Container da categoria
        <div className='w-full bg-[#5F2E09] rounded-md hover:bg-[#3E1900] shadow-[0px_2px_2px_2px_rgba(0,0,0,0.25)] h-[200px] flex relative'>
          <div className={`transition-opacity duration-200 rounded-md  w-full bg-[#5F2E09] flex justify-center  items-center justify-center ${!showCategoryProducts ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            style={{
              backgroundImage: `url('/img/texture.png')`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: backgroundSize,
            }}
          >
          <div className="flex flex-col justify-center flex-wrap w-full  "> 
            <figure className='w-[4.5rem] mx-auto h-[4.5rem] rounded-full alt-color-4-bg border-4 border-[#D87B26] shadow-[inset_-2px_3px_2px_4px_rgba(0,0,0,0.2)]'>
              {props.categoryImage ? (
                <img
                  src={`http://localhost:3001${props.categoryImage}`}
                  alt={props.categoryName}
                  className='w-full h-full object-cover rounded-full'
                />
              ) : null}
            </figure>
            
            <div className="flex flex-col w-[100%] h-full text-ellipsis text-wrap text-center justify-center mx-auto ">
              
                <p className={`my-2  mx-auto px-1 poppins-semibold  ${windowWidth > 450?'text-[15px]  ':'text-[13px]'} w-full  text-center`} style={{ color: "var(--tertiary-color)" }}>
                  {props.categoryName}
                </p>
                
              
              <div className="flex justify-center rounded-md w-[100%] mt-4 mx-auto  poppins-medium mx-auto">
                <p className="cursor-pointer text-center mx-2 flex flex-col justify-center w-8" onClick={handleClickShow} style={{ color: "var(--tertiary-color)" }}>
                  {/* <i className="fa-solid fa-eye"></i> */}
                  <img src='/img/eye.png' alt="eye" className='w-6'/>
                </p>
                <p className="cursor-pointer text-center mx-2 flex flex-col justify-center w-8" onClick={() => confirmDeleteCategory(props.categoryKey)} style={{ color: "var(--tertiary-color)" }}>
                  {/* <i className="fa-solid fa-trash"></i> */}
                  <img src='/img/trash_can.png' alt="trash can" className='w-4'/>
                </p>
                <p className="cursor-pointer text-center mx-2 flex flex-col justify-center w-8" onClick={() => openCategoryModal(props.category)} style={{ color: "var(--tertiary-color)" }}>
                  {/* <i className="fa-solid fa-pencil"></i> */}
                  <img src='/img/pencil.png' alt="pencil" className='w-4'/>
                </p>
              </div>
            </div>


            </div>
     
        </div>

            

        {/* Modal de produto */}
        {isModalOpen && (
  <div className="modal modal-open text-slate-400 ">
    <div className="modal-box">
      <h3 className="font-bold text-lg text-white">Adicionar novo produto</h3>

      <form onSubmit={handleSubmit}>
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text text-white">Nome do produto</span>
          </label>
          <input
            type="text"
            placeholder="Digite o nome do produto"
            className="input input-bordered placeholder:text-slate-300"
            required
            name='product_name'
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </div>

        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text text-white">Descrição (Opcional)</span>
          </label>
          <textarea
            placeholder="Digite a descrição do produto"
            className="textarea textarea-bordered"
            name='description'
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
          ></textarea>
        </div>

        <input type="hidden" value={props.categoryKey} />

        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text text-white">Unidade</span>
          </label>
          <select
            value={productUnitId}
            onChange={(e) => setProductUnitId(parseInt(e.target.value))}
            className="select select-bordered"
          >
            <option disabled value="">Selecionar unidade</option>
            {units.map((unit) => (
              <option key={unit.unit_id} value={unit.unit_id}>{unit.unit_type}</option>
            ))}
          </select>
        </div>

        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text text-white">Fornecedor</span>
          </label>
          <select
            value={productSupplierId}
            onChange={(e) => setProductSupplierId(parseInt(e.target.value))}
            className="select select-bordered"
          >
            <option disabled value="">Selecionar fornecedor</option>
            {suppliers.map((supplier) => (
              <option key={supplier.supplier_id} value={supplier.supplier_id}>{supplier.supplier_name}</option>
            ))}
          </select>
        </div>

        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text text-white">Preço de Custo</span>
          </label>
          <input
            type="number"
            placeholder="Digite o preço de custo"
            className="input input-bordered placeholder:text-slate-300"
            required
            name='cost_price'
            value={productCostValue}
            onChange={(e) => setProductCostValue(parseFloat(e.target.value) || 0)} 
          />
        </div>

        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text text-white">Preço de Venda</span>
          </label>
          <input
            type="number"
            placeholder="Digite o preço de venda"
            className="input input-bordered placeholder:text-slate-300"
            required
            name='sell_price'
            value={productSellValue}
            onChange={(e) => setProductSellValue(parseFloat(e.target.value) || 0)} 
          />
        </div>

        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text text-white">Local</span>
          </label>
          <select
            value={productLocalId}
            onChange={(e) => setProductLocalId(parseInt(e.target.value))}
            className="select select-bordered"
          >
            <option disabled value="">Selecionar local</option>
            {local.map((local) => (
              <option key={local.local_id} value={local.local_id}>{local.local_name}</option>
            ))}
          </select>
        </div>

        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text text-white">Setor</span>
          </label>
          <select
            value={productSectorId}
            onChange={(e) => setProductSectorId(parseInt(e.target.value))}
            className="select select-bordered"
          >
            <option disabled value="">Selecionar setor</option>
            {sectors.map((sector) => (
              <option key={sector.sector_id} value={sector.sector_id}>{sector.sector_name}</option>
            ))}
          </select>
        </div>
{/* 
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text text-white">Lotes</span>
          </label>
          <select
            value={productBatchId || ""}
            onChange={(e) => setProductBatchId(parseInt(e.target.value))}
            className="select select-bordered"
          >
            <option disabled value="">Selecionar lote</option>
            {batch.map((batch) => (
              <option key={batch.batch_id} value={batch.batch_id}>{batch.batch_id}</option>
              
            ))}
          </select>
        </div> */}

        <div className="form-control mb-4">
          <label className="cursor-pointer label">
            <span className="label-text text-white">É perecível</span>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={isPerishable}
              onChange={(e) => setIsPerishable(e.target.checked)}
            />
          </label>
        </div>

        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text text-white">Data de Validade</span>
          </label>
          <input
            type="date"
            className="input input-bordered placeholder:text-slate-300"
            name="expiration_date"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            disabled={!isPerishable}
          />
        </div>

        <div className="modal-action">
          <label htmlFor="product-modal" className="btn" onClick={closeModal}>Cancelar</label>
          <button type="submit" className="btn btn-primary">Salvar</button>
        </div>
      </form>
    </div>
  </div>
)}


{/* Modal para editar produto */}
{isProdEditModalOpen && (
  <Modal closeModal={closeProdEditModal} title="Editar Produto" handleSubmit={handleProdUpdate}>
    <div className="form-control mb-4">
      <label className="label">
        <span className="label-text text-white">Nome do produto</span>
      </label>
      <input 
        type="text" 
        placeholder="Digite o nome do produto" 
        className="input input-bordered placeholder:text-slate-300" 
        required 
        name='product_name' 
        value={productName} 
        onChange={(e) => setProductName(e.target.value)} 
      />
    </div>

    <div className="form-control mb-4">
      <label className="label">
        <span className="label-text text-white">Descrição (Opcional)</span>
      </label>
      <textarea 
        placeholder="Digite a descrição do produto" 
        className="textarea textarea-bordered" 
        name='description' 
        value={productDescription} 
        onChange={(e) => setProductDescription(e.target.value)}
      />
    </div>

    <div className="form-control mb-4">
      <label className="label">
        <span className="label-text text-white">Unidade</span>
      </label>
      <select 
        value={productUnitId} 
        onChange={(e) => setProductUnitId(parseInt(e.target.value))} 
        className="select select-bordered"
      >
        <option disabled value="">Selecionar unidade</option>
        {units.map((unit) => (
          <option key={unit.unit_id} value={unit.unit_id}>{unit.unit_type}</option>
        ))}
      </select>
    </div>

    <div className="form-control mb-4">
      <label className="label">
        <span className="label-text text-white">Fornecedor</span>
      </label>
      <select 
        value={productSupplierId} 
        onChange={(e) => setProductSupplierId(parseInt(e.target.value))} 
        className="select select-bordered"
      >
        <option disabled value="">Selecionar fornecedor</option>
        {suppliers.map((supplier) => (
          <option key={supplier.supplier_id} value={supplier.supplier_id}>{supplier.supplier_name}</option>
        ))}
      </select>
    </div>

    <div className="form-control mb-4">
      <label className="label">
        <span className="label-text text-white">Preço de Custo</span>
      </label>
      <input 
        type="number" 
        placeholder="Digite o preço de custo" 
        className="input input-bordered placeholder:text-slate-300" 
        required 
        name='cost_price' 
        value={productCostValue} 
        onChange={(e) => setProductCostValue(parseFloat(e.target.value) || 0)} 
      />
    </div>

    <div className="form-control mb-4">
      <label className="label">
        <span className="label-text text-white">Preço de Venda</span>
      </label>
      <input 
        type="number" 
        placeholder="Digite o preço de venda" 
        className="input input-bordered placeholder:text-slate-300" 
        required 
        name='sell_price' 
        value={productSellValue} 
        onChange={(e) => setProductSellValue(parseFloat(e.target.value) || 0)} 
      />
    </div>

    <div className="form-control mb-4">
      <label className="label">
        <span className="label-text text-white">Local</span>
      </label>
      <select 
        value={productLocalId} 
        onChange={(e) => setProductLocalId(parseInt(e.target.value))} 
        className="select select-bordered"
      >
        <option disabled value="">Selecionar local</option>
        {local.map((local) => (
          <option key={local.local_id} value={local.local_id}>{local.local_name}</option>
        ))}
      </select>
    </div>

    <div className="form-control mb-4">
      <label className="label">
        <span className="label-text text-white">Setor</span>
      </label>
      <select 
        value={productSectorId} 
        onChange={(e) => setProductSectorId(parseInt(e.target.value))} 
        className="select select-bordered"
      >
        <option disabled value="">Selecionar setor</option>
        {sectors.map((sector) => (
          <option key={sector.sector_id} value={sector.sector_id}>{sector.sector_name}</option>
        ))}
      </select>
    </div>

    {/* <div className="form-control mb-4">
      <label className="label">
        <span className="label-text text-white">Lotes</span>
      </label>
      <select 
        value={productBatchId || ""} 
        onChange={(e) => setProductBatchId(parseInt(e.target.value))} 
        className="select select-bordered"
      >
        <option disabled value="">Selecionar lote</option>
        {batch.map((batch) => (
          <option key={batch.batch_id} value={batch.batch_id}>{batch.batch_id}</option>
        ))}
      </select>
    </div> */}

    <div className="form-control mb-4">
      <label className="cursor-pointer label">
        <span className="label-text text-white">É perecível</span>
        <input 
          type="checkbox" 
          className="toggle toggle-primary" 
          checked={isPerishable} 
          onChange={(e) => setIsPerishable(e.target.checked)} 
        />
      </label>
    </div>

    <div className="form-control mb-4">
      <label className="label">
        <span className="label-text text-white">Data de Validade</span>
      </label>
      <input 
        type="date" 
        className="input input-bordered placeholder:text-slate-300" 
        name="expiration_date" 
        value={expirationDate} 
        onChange={(e) => setExpirationDate(e.target.value)} 
        disabled={!isPerishable} 
      />
    </div>
  </Modal>
)}

      {/* Modal de edição de categoria */}
      {isCategoryModalOpen && (
        <ShortModal
            title="Editar categoria"
            handleSubmit={handleCategoryUpdate}
            modalName="editar-categoria"
            closeModal={closeCategoryModal}
        >
            <div className='w-full flex flex-col items-center mt-4 '>
              <label className='label'>Imagem da categoria</label>
              <div
                className="bg-[#FFC376] p-[1rem] h-[14rem] w-[14rem] flex items-center justify-center border-8 border-[#D87B26] cursor-pointer shadow-[0px_2px_2px_2px_rgba(0,0,0,0.25)] shadow-[inset_-2px_5px_2px_2px_rgba(0,0,0,0.25)] relative"
                onClick={() => document.getElementById('category-image-input').click()}
              >
                <input
                  type="file"
                  id="category-image-input"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0]
                    if (file) {
                      setCategoryImage(file)
                      setImagePreview(URL.createObjectURL(file))
                    }
                  }}
                  name="category-image"
                />
                {imagePreview ? (
                  <img src={imagePreview} alt="preview da imagem" className="w-full h-full z-0 absolute object-cover inset-0" />
                ) : (
                  <i className="fa-solid fa-plus text-5xl cursor-pointer alt-color-5"></i>
                )}
              </div>
            </div>

            <div className="form-control mb-4">
                <label className="label">
                    <span className="label-text alt-color-5">Nome da categoria</span>
                </label>
                <input type="text" placeholder="Digite o nome da categoria" className="p-[4px] shadow-[0px_2px_2px_2px_rgba(0,0,0,0.25)] ring ring-2 ring-[#BF823C] focus:ring-[#3E1A00] outline-none quinteral-color-bg rounded font-pixel text-xl transition-all duration-[100ms] ease-in-out alt-color-5" required value={categoryName} onChange={(e) => setCategoryName(e.target.value)} name='category-name' />
            </div>
        </ShortModal>
      )}

      {showDeleteCategoryModal && (
          <DeleteConfirmationModal
              title="Confirmar Exclusão"
              message="Você tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita."
              onConfirm={handleDeleteCategoryConfirm}
              onCancel={handleDeleteCategoryCancel}
          />
      )}

      {/* Componente flash message, verifica se o estado flash é true e então renderiza a flash message */}
      {flash && (
          <FlashMessage
              message={flash.message}
              type={flash.type}
              duration={3000}
              onClose={() => setFlash(null)}
          />
      )}
    </div>
    )
}

export default ProductCategory