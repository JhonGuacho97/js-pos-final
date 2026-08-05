import React from "react";
import MasterLayout from "../MasterLayout";
import CreditNoteForm from "./CreditNoteForm";
import HeaderTitle from "../header/HeaderTitle";

const CreateCreditNote = () => {
    return (
        <MasterLayout>
          <HeaderTitle title="Nota de Crédito" to='/app/credit-notes'/>
            <CreditNoteForm />
        </MasterLayout>
    );
};

export default CreateCreditNote;
