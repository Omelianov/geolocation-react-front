import React, { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  ContainerHeader,
  TableHead,
  Data,
  TableRow,
  TableDataDate,
  TableDataType,
  TableData,
  TableDataCategory,
  TableDataComment,
  TableDataColor,
  PencilButton,
  CustomButton,
  AddButton,
  PlusIcon,
} from './Home.styled';
import Modal from '../../components/Modal/Modal';
import AddTransaction from '../../components/Add/Add';
import EditTransaction from '../../components/Edit/Edit';
import Logout from '../../components/Logout/Logout';
import { toggleAddModal, toggleEditModal } from '../../redux/modal/ModalSlice';
import { selectModalState, selectModalTypeState } from '../../redux/modal/selectors';
import { BiPencil } from 'react-icons/bi';
import { RotatingLines } from 'react-loader-spinner';
import { TransactionCard } from './TransactionCard/TransactionCard';
import { fetchTransactions, deleteItem } from '../../redux/transactionsRedux/transactionsOperations';
import { ScrollToTopButton } from './ScrollToTopButton/ScrollToTopButton';
import { transactionSlice } from '../../redux/transactionsRedux/transactionsSlice';
import { selectIsLoading } from '../../redux/transactionsRedux/transactionsSelectors';

const Home = () => {
  const dispatch = useDispatch();
  const [id, setId] = useState(null);
  const modalType = useSelector(selectModalTypeState);
  const isModalOpen = useSelector(selectModalState);
  const isMobile = useMediaQuery({ minWidth: 240, maxWidth: 767 });
  const isLoading = useSelector(selectIsLoading);


  const deleteTransactions = id => {
    dispatch(deleteItem(id)).then(() => {
      dispatch(fetchTransactions());
    });
  };

  const handleEditClick = id => {
    setId(id);
    dispatch(toggleEditModal());
  };

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  const allTransactions = useSelector(
    state => state[transactionSlice.name].transactions
  );
  const sortedTransactions = allTransactions
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const top5Transactions = sortedTransactions.slice(0, 5);

  return (
    <Container>
      {!isMobile ? (
        <ContainerHeader>
          <TableHead>
            <div>Date</div>
            <div>Type</div>
            <div>Category</div>
            <div>Comment</div>
            <div>Sum</div>
          </TableHead>
          <Data>
            {isLoading ? (
              <TableRow>
                <div>
                  <RotatingLines visible={true} height="80" width="80" />
                </div>
              </TableRow>
            ) : (
              top5Transactions.map(
                ({ createdAt, type, category, comment, value, _id }) => {
                  let date = new Date(createdAt).toLocaleDateString();
                  let numberSign = '+';
                  let colorClassName = 'colorIncome';
                  if (type === 'expense') {
                    numberSign = '-';
                    colorClassName = 'colorExpense';
                  }
                  return (
                    <TableRow key={_id} className="data">
                      <TableDataDate>{date}</TableDataDate>
                      <TableDataType>{numberSign}</TableDataType>
                      {type === 'income' ? (
                        <TableData>Income</TableData>
                      ) : (
                        <TableDataCategory>{category}</TableDataCategory>
                      )}
                      <TableDataComment>{comment}</TableDataComment>

                      <TableDataColor type={type} className={colorClassName}>
                        {value}
                      </TableDataColor>
                      <PencilButton>
                        <BiPencil onClick={() => handleEditClick(_id)} />
                        <CustomButton
                          style={{}}
                          className="deleteItem"
                          onClick={() => {
                            deleteTransactions(_id);
                          }}
                        >
                          Delete
                        </CustomButton>
                      </PencilButton>
                    </TableRow>
                  );
                }
              )
            )}
          </Data>
        </ContainerHeader>
      ) : (
        // Render Cards
        <>
          <ScrollToTopButton />
          <TransactionCard
            transactions={top5Transactions}
            handleEditClick={handleEditClick}
            deleteTransactions={deleteTransactions}
          />
        </>
      )}

      <AddButton
        className="addItem"
        type="button"
        onClick={() => dispatch(toggleAddModal())}
      >
        <PlusIcon />
      </AddButton>

      {modalType === 'modal/toggleAddModal' && isModalOpen && (
        <Modal children={<AddTransaction />} />
      )}
      {modalType === 'modal/toggleEditModal' && isModalOpen && (
        <Modal children={<EditTransaction id={id} />} />
      )}
      {modalType === 'modal/toggleLogOutModal' && isModalOpen && (
        <Modal children={<Logout />} showCloseIcon={false} />
      )}
    </Container>
  );
};

export default Home;