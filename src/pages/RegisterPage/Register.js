import RegisterForm from '../../components/RegisterForm/RegisterForm';
import { ContentContainer, MainContainer } from '../../components/RegisterForm/RegisterForm.styled';

const Register = () => {
  return (
    <MainContainer isRegister>
      <ContentContainer>
        <RegisterForm />
      </ContentContainer>
    </MainContainer>
  );
};

export default Register;
