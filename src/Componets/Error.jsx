import "../Style/Error.css";
import { CloseCircleOutlined } from '@ant-design/icons';

export default function Error({ Message = "Something went wrong." }) {
    return (
        <div className="ErrorContainer">
            <div className="ErrorCard">
                <CloseCircleOutlined style={{ fontSize: 64, color: '#ff4d4f' }} />
                <h1>Error</h1>
                <p>{Message || "Oops! Something Went Wrong :("}</p>
                <button onClick={() => window.location.reload()}>Reload</button>
            </div>
        </div>
    );
}
