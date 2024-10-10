import { useEffect, useState } from 'react'
import './ProductCategory.module.css'
import styles from './ProductCategory.module.css'
import api from '../../services/api'
import Loading from '../Loading/Loading'
import 'react-tippy/dist/tippy.css'
import { Tooltip } from 'react-tippy'

/**
 * Componente que exibe o container da categoria com os produtos dentro
 */

function ProductCategory(props) {
  /**
   * Criação da renderização do componente de loading
   */
  const [loading, setLoading] = useState(true)

  /**
   * Criação dos quadrados dos produtos no inventário
   */
    const [squares, setSquares] = useState([])

    const fetchProducts = async () => {
      try {
        const response = await api.get('/products')
        setSquares(Array(response.data.length).fill({}))
      } catch(err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
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
     * Hook de useEffect para ativar as funções quando o componente é renderizado
     */
    useEffect(() => {
      const fetchData = async () => {
        setLoading(true)
        await fetchUnits()
        await fetchSuppliers()
        await fetchProducts()
      }

      fetchData()
    }, [])

    /**
     * Abre e fecha o modal de cadastro
     */
    const [isModalOpen, setIsModalOpen] = useState(false)

    const openModal = () => setIsModalOpen(true)
    const closeModal = () => setIsModalOpen(false)

    /**
     * Criação da requisição para envio ao servidor back-end
     */
    const [productName, setProductName] = useState('')
    const [productDescription, setProductDescription] = useState(null)
    const [productUnitId, setProductUnitId] = useState('')
    const [productSupplierId, setProductSupplierId] = useState('')
    const [isPerishable, setIsPerishable] = useState(false)

    const handleSubmit = async(e) => {
      e.preventDefault()

      const ProductData = {
          product_name: productName,
          description: productDescription,
          category_id: props.categoryKey,
          supplier_id: productSupplierId,
          is_perishable: isPerishable,
          unit_id: productUnitId,
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
          closeModal()
      } catch (err) {
          console.log(err)
      }
  }

  /**
   * Deleta o produto
   */
  const handleDelete = async (product_id) => {
    try {
      await api
        .delete(`/products/${product_id}`)
        .then((response) => {
          props.onProductDeleted(response.data)
        });
    } catch (err) {
      console.log(err)
    }
  }

  const [hoveredProductId, setHoveredProductId] = useState(null)

    return (
    <div className='w-full alt-color-2-bg rounded border-[15px] border-[#6B3710] shadow-[0px_2px_2px_2px_rgba(0,0,0,0.25)] mt-4'>
        <div className='border-l-[6px] border-r-[6px] border-[#D87B26] p-[1rem] h-[200px] overflow-y-auto flex flex-wrap'>
            {/*
              Aqui ocorre a criação de cada quadrado, é obtido uma lista com todos os produtos
              que são mapeados, cada produto irá gerar um quadrado e cada quadrado terá sua tooltip           
            */}
            {props.products.map((product, index) => {
              const unit = units.find((u) => u.unit_id === product.unit_id)?.unit_type || 'N/A'
              return (
                <Tooltip
                key={index}
                html={(
                  <div className={styles.myTippyTheme}>
                    <strong>Nome:</strong> {product.product_name}<br />
                    <strong>Unidade:</strong> {unit}<br />
                    <strong>Perecível:</strong> {product.is_perishable ? 'Sim' : 'Não'}
                  </div>
                )}
                title={product.product_name}
                arrow={true}
                theme='dark'
                delay={20}
                trigger='mouseenter'
              >
                <div key={index} className={`relative w-12 h-12 mb-4 bg-transparent border-l-[3px] border-b-[3px] border-[#FFE4A1] cursor-pointer ${styles.borderDepth}`} id={product.product_id} onMouseEnter={() => setHoveredProductId(product.product_id)}
                onMouseLeave={() => setHoveredProductId(null)}>
                {hoveredProductId === product.product_id && (
                  <i 
                    className="fa-solid fa-trash absolute top-[-10px] right-[-5px] text-red-500 cursor-pointer" 
                    onClick={() => handleDelete(product.product_id)}
                  ></i>
                )}
                </div>
              </Tooltip>
              )
            })}

            {/* Botão para adicionar novo produto */}
            <button
                onClick={openModal}
                className="w-12 h-12 alt-color-4-bg border-[3px] border-[#D87B26] flex items-center justify-center text-2xl"
            >
            <i class="fa-solid fa-plus"></i>
            </button>
        </div>

        {/* Modal de produto */}
        {isModalOpen && (
          <div className="modal modal-open text-slate-400">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-white">Adicionar novo produto</h3>

            <form onSubmit={handleSubmit}>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text text-white">Nome do produto</span>
                </label>
                <input type="texconst [hoveredProductId, setHoveredProductId] = useState(null)" placeholder="Digite o nome do produto" className="input input-bordered placeholder:text-slate-300" required name='product_name' value={productName} onChange={(e) => setProductName(e.target.value)} />
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text text-white">Descrição (Opcional)</span>
                </label>
                <textarea placeholder="Digite a descrição do produto" className="textarea textarea-bordered" name='description' value={productDescription} onChange={(e) => setProductDescription(e.target.value)}></textarea>
              </div>

              <input type="hidden" value={props.categoryKey} />

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text text-white">Unidade</span>
                </label>
                <select value={productUnitId} onChange={(e) => setProductUnitId(parseInt(e.target.value))} className="select select-bordered">
                  <option disabled selected value="">Selecionar unidade</option>
                  {units.map((unit) => (
                    <option key={unit.unit_id} value={unit.unit_id}>{unit.unit_type}</option>
                  ))}
                </select>
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text text-white">Fornecedor</span>
                </label>
                <select value={productSupplierId} onChange={(e) => setProductSupplierId(parseInt(e.target.value))} className="select select-bordered">
                  <option disabled selected value="">Selecionar fornecedor</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.supplier_id} value={supplier.supplier_id}>{supplier.supplier_name}</option>
                  ))}
                </select>
              </div>

              <div className="form-control mb-4">
                <label className="cursor-pointer label">
                  <span className="label-text text-white">É perecível</span>
                  <input type="checkbox" className="toggle toggle-primary" checked={isPerishable} onChange={(e) => setIsPerishable(e.target.checked)} />
                </label>
              </div>

              <div className="modal-action">
                <label htmlFor="product-modal" className="btn" onClick={closeModal}>Cancelar</label>
                <button type="submit" className="btn btn-primary">Salvar</button>
              </div>
            </form>
          </div>
          </div>
      )}
    </div>
    )
}

export default ProductCategory
