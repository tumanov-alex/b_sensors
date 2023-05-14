export const NoData = ({ hasNumbers }: { hasNumbers: boolean }) => {
    return (
        <div className={`no-data-message ${hasNumbers ? 'hidden' : ''}`}>
            <img className="icon" src={'../no_data.svg'}
                 alt="No data"/>
        </div>
    );
};
